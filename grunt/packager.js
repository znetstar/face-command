const packager = require('electron-packager');
const { extend, cloneDeep } = require('lodash');
const fs = require('fs');
const path = require('path');
const { rm } = require('shelljs');
const project_root = path.join(__dirname, "..");
const icon_root = path.join(project_root, "icons");
const pkg = JSON.parse(fs.readFileSync(path.join(project_root, 'package.json'), 'utf8'));
const icon = path.join(icon_root, 'app-icon');
const out_dir = path.join(project_root, 'build');

module.exports = (grunt) => {
    grunt.registerTask("packager", async function (arg1) {
        grunt.task.requires("icons");
        let done = this.async();

        if (fs.existsSync(out_dir))
            rm('-rf', out_dir);
        
        let default_options = {
            icon: icon,
            dir: project_root,
            name: "face-command",
            overwrite: true,
            appVersion: pkg.version,
            ignore: [ 
                /grunt/g, 
                /icons\/.*\.svg$/g,
                /\.git.*/g,
                /\.npmignore$/g,
                /Gruntfile\.js$/g,
                /^docs$/g,
                /^build$/g,
                /^dist$/g
            ],
            out: out_dir,
            asar: false
        };

        let options = extend(cloneDeep(grunt.config.get("packager")), default_options);
        
        if (arg1 === 'all') {
            options.all = true;
        }

        if (options.platform === 'darwin' || options.all || (!options.platform && process.platform === 'darwin')) {
            options.appBundleId = 'nyc.zacharyboyd.face-command';
            options.appCategoryType = 'public.app-category.utilities';
        }

        let paths = await packager(options);

        console.log(`created:\n${paths.join("\n")}`);
        done();
    });
};