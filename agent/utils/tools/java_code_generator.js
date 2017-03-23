/*
 * Copyright 2017 dmb.star-net.cn
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fs =require('fs');
var path = require('path');

var codeDirArray = ['src', 'main', 'java', 'com', 'navercorp', 'pinpoint', 'plugin'];
var resourceDirArray = ['src', 'main', 'resources', 'META-INF', 'services'];
var resourcePluginFile = 'com.navercorp.pinpoint.bootstrap.plugin.ProfilerPlugin';
var resourceMetadataFile = 'com.navercorp.pinpoint.common.trace.TraceMetadataProvider';

var JavaCodeGenerator = function javaCodeGenerator(pluginName) {

    console.log('javaCodeGenerator init');

    this.pluginDir = this.getPluginDir(pluginName);
    this.pluginName = pluginName.replace('-', '_');
    this.projectDir = this.generateProject();

    this.pluginConstantsList = this.getPluginConstantsFile();

    this.setReousrceMetadataProviderFile();
    this.setJavaConstantsFile();
    this.setJavaMetadataProviderFile();
    this.setPomFile();

    setTimeout(function () {
        console.log('javaCodeGenerator done');
        console.log(''); 
        console.log('please check the property of plugin ServiceType'); 
        console.log('now, you can execute cmd below: '); 
        console.log('cd ' + this.proxy.projectDir); 
        console.log('mvn -Dmaven.test.skip=true compile package'); 
        }.bind({proxy: this}),
        2000);
};

JavaCodeGenerator.prototype.generateProject = function () {
    var projectDir = path.join(__dirname, this.pluginName);
    console.log('create project: ' + this.pluginName);
    //build project
    //mkdir code dir
    mkdirSync(projectDir, codeDirArray);
    //mkdir package
    mkdirSync(path.join(projectDir, codeDirArray.join(path.sep)), [this.pluginName]);
    //touch code file
    this.javaConstantsFile = touchSync(path.join(projectDir, codeDirArray.join(path.sep),
                this.pluginName, this.pluginName + '_constants.java'));
    this.javaMetadataProviderFile = touchSync(path.join(projectDir, codeDirArray.join(path.sep), 
                this.pluginName, this.pluginName + '_metadata_provider.java'));
    this.javaPackage = 'com.navercorp.pinpoint.plugin.' + this.pluginName;
    this.javaMetaDataProviderClassName = this.javaPackage + '.' + 
            this.getClassName(this.javaMetadataProviderFile);
    //mkdir resource dir
    mkdirSync(projectDir, resourceDirArray);
    //touch resource file
    this.resourcePluginFile =  touchSync(path.join(projectDir, resourceDirArray.join(path.sep), resourcePluginFile));
    this.resourceMetadataFile = touchSync(path.join(projectDir, resourceDirArray.join(path.sep), resourceMetadataFile));
    return projectDir;
};

JavaCodeGenerator.prototype.getPluginDir = function (pluginName) {
    var pluginType = ['core', 'user'];
    var pluginDir;
    var prefixDir = __dirname;
    for (var i=0; i<2; i++) {
        //delete useless dir
        prefixDir = prefixDir.substr(0, prefixDir.lastIndexOf(path.sep));  
    }
    for (var type in pluginType) {
        //judge of core/user
        pluginDir = path.join(prefixDir, 'plugins', pluginType[type], pluginName);
        if (!fs.existsSync(pluginDir)) {
            pluginDir = undefined;
        } else {
            console.log('get plugin dir: ' + pluginDir);
            return pluginDir;
        }
    }
    if (!pluginDir) {
        throw new Error('doesn\'t find plugin in core/user: ' + pluginName);
    }
};

JavaCodeGenerator.prototype.getPluginConstantsFile = function () {
    if (!fs.existsSync(this.pluginDir)) {
        console.error('can not find plugin dir: ' + this.pluginDir);
        return ;
    }
    var li = fs.readdirSync(this.pluginDir);
    for (var i in li) {
        if (li[i].toLowerCase().indexOf('constants') === -1) {
            delete li[i];
        }
    }
    li = li.filter(function (item) {
        return item.length !== 0;
    });
    console.log('get plugin constants file: ' + li);
    return li;
};

JavaCodeGenerator.prototype.setReousrceMetadataProviderFile = function () {
    //write meta data info
    fs.open(this.resourceMetadataFile, 'w', function (err, fd) {
        console.log('start operate resource metadata provider file: ' + this.proxy.resourceMetadataFile);
        if (err) {
            console.error('write file error: ' + this.proxy.resourceMetadataFile);
            return ;
        }
        var str = this.proxy.javaMetaDataProviderClassName;
        fs.writeSync(fd, str, 0, str.length, 0); 
        console.log('complete operate resource metadata provider file: ' + this.proxy.resourceMetadataFile);
    }.bind({proxy: this}));
};

JavaCodeGenerator.prototype.getClassName = function (filename) {
    return filename.substring(filename.lastIndexOf(path.sep) + 1, filename.lastIndexOf('.'));
};

JavaCodeGenerator.prototype.setJavaConstantsFile = function () {
    if (this.pluginConstantsList === undefined || this.pluginConstantsList.length === 0) {
        console.error('can not find any constants file in plugin dir');
        return;
    }
    //set file content
    console.log('start operate java constants file: ' + this.javaConstantsFile);
    var data = [];
    data.push(this.autoGeneratedTip());
    data.push('package ' + this.javaPackage + ';');
    data.push('import com.navercorp.pinpoint.common.trace.*;');
    data.push('public class ' + this.getClassName(this.javaConstantsFile) +' {');
    data.push('private ' + this.getClassName(this.javaConstantsFile) +' (){}');
    //start to write constants 
    for (var i in this.pluginConstantsList) {
        var constants = require(path.join(this.pluginDir, this.pluginConstantsList[i])); 
        //service type
        var item;
        for (item in constants.ServiceTypeConstants) {
            data.push('public static final ServiceType ' +
                    item + 
                    ' = ' +
                    'ServiceTypeFactory.of(' + 
                    constants.ServiceTypeConstants[item] +
                    ', "' + 
                    item + 
                    '", ServiceTypeProperty.RECORD_STATISTICS);' 
                    );
        }
        //annotation type
        for (item in constants.AnnotationConstants) {
            data.push('public static final AnnotationKey ' +
                    item + 
                    ' = ' +
                    'AnnotationKeyFactory.of(' + 
                    constants.AnnotationConstants[item] +
                    ', "' + 
                    item + 
                    '", AnnotationKeyProperty.VIEW_IN_RECORD_SET);' 
                    );
        }
    
    }
    data.push('}');
    fs.writeFile(this.javaConstantsFile, data.join('\n'));
    console.log('complete operate java constants file: ' + this.javaConstantsFile);
};

JavaCodeGenerator.prototype.setJavaMetadataProviderFile = function () {
    console.log('start operate java metadata provider file: ' + this.javaMetadataProviderFile);

    var data = [];
    data.push(this.autoGeneratedTip());
    data.push('package ' + this.javaPackage + ';');
    data.push('import com.navercorp.pinpoint.common.trace.AnnotationKey;');
    data.push('import com.navercorp.pinpoint.common.trace.AnnotationKeyProperty;');
    data.push('import com.navercorp.pinpoint.common.trace.TraceMetadataProvider;');
    data.push('import com.navercorp.pinpoint.common.trace.TraceMetadataSetupContext;');
    data.push('public class ' + this.getClassName(this.javaMetadataProviderFile) +
            ' implements TraceMetadataProvider {');
    data.push('@Override');
    data.push('public void setup(TraceMetadataSetupContext context) {');

    for (var i in this.pluginConstantsList) {
        var constants = require(path.join(this.pluginDir, this.pluginConstantsList[i])); 

        var item;
        for (item in constants.ServiceTypeConstants) {
            data.push('context.addServiceType(' +
                        this.getClassName(this.javaConstantsFile) +
                        '.' +
                        item +
                      ');'
                    );
        }
        for (item in constants.AnnotationConstants) {
            data.push('context.addAnnotationKey(' +
                        this.getClassName(this.javaConstantsFile) +
                        '.' +
                        item +
                      ');'
                    );
        }
    }

    data.push('}');
    data.push('}');

    fs.writeFile(this.javaMetadataProviderFile, data.join('\n'));
    console.log('complete operate java metadata provider file: ' + this.javaMetadataProviderFile);
};

JavaCodeGenerator.prototype.setPomFile = function () {
    var pomFile = path.join(__dirname, 'sample', 'pom.xml');
    var destPomFile = path.join(this.projectDir, 'pom.xml');
    //replace ${PLUGINNAME}
    fs.open(pomFile, 'r', function (err, fd) {

        if (err) {
            console.error('open pom file error: ' + pomFile + ',' + err);
        } 

        var readable = fs.createReadStream(null, {fd: fd, encoding: 'utf8'});
        readable.on('data', function (data) {
            console.log('pom.xml: start operate');
            data = data.replace(/\$\{PLUGINNAME\}/g, this.proxy.pluginName);
            var writeable =fs.createWriteStream(destPomFile);
            writeable.write(data);
        }.bind({proxy: this.proxy})) ;

        readable.on('end', function () {
            console.log('pom.xml: complete operate');
        });

    }.bind({proxy: this}));
};

JavaCodeGenerator.prototype.autoGeneratedTip = function () {
    return '//Autogenerated by javaCodeGenerator, Date: ' + (new Date()).toLocaleString();
};

function mkdirSync(projectDir, dirArray) {
    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir);
        console.log('create project dir: ' + projectDir);
    }
    for (var i=0; i<dirArray.length; i++) {
        var tmpDir = '';
        for (var j=0; j<=i; j++) {
            tmpDir = path.join(tmpDir, dirArray[j]);
        }
        var targetDir = path.join(projectDir, tmpDir);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
            console.log('create target dir: ' + targetDir);
        }
    } 
}

function touchSync(filename) {
    console.log('create file: ' + filename);
    fs.openSync(filename, 'w'); 
    return filename;
}

if (process.argv.length === 2) {
    console.log('usage: node javaCodeGenerator.js ${pluginName}');
    return;
}

new JavaCodeGenerator(process.argv[2]);

module.exports = {};
