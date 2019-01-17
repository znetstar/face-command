
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { mkdir, ls } = require('shelljs');
const tar = require('tar');
const project_root = path.join(__dirname, "..");
const dist_root = path.join(project_root, 'dist');
const build_root = path.join(project_root, 'build');

module.exports = (grunt) => {
    grunt.registerTask("zipper", async function () {
        const done = this.async();

        mkdir('-p', dist_root);

        let folders = ls(build_root);
        for (let folder of folders) {
            let platform = folder.match(/^aria2ui-(.*)-/);
            if (!platform) 
                continue;
            
            platform = platform[1];

            let archive_path;
            let folder_path = path.join(build_root, folder);

            if (platform === 'win32') {
                const zip = new AdmZip();
            
                zip.addLocalFolder(folder_path, folder);
                let zip_name = `${folder}.zip`;
                archive_path = path.join(dist_root, zip_name);
                zip.writeZip(archive_path);
            }
            else {
                archive_path = path.join(dist_root, `${folder}.tgz`);

                await tar.c(
                {
                    file: archive_path,
                    gzip: true,
                    strip: folder_path.split(path.sep).length - 1,
                    cwd: folder_path,
                    prefix: folder
                },
                ['.']
                );
            }
            console.log(`wrote: ${archive_path}`);
        }

        done();
    });
};