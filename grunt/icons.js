const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const to_ico = require('to-ico');
const { mkdir, exec, cp, rm } = require('shelljs');

const project_root = path.join(__dirname, "..");
const icon_root = path.join(project_root, "icons");
const icon_source = path.join(icon_root, "app-icon.svg");
const iconset_folder = path.join(icon_root, "app-icon.iconset");
const mac_icns_dest = path.join(icon_root, "app-icon.icns");
const windows_ico_dest = path.join(icon_root, "app-icon.ico");
const generic_dest = path.join(icon_root,  "app-icon.png");

const mac_icon_sizes = [16,32,64,128,256,512];
const windows_icon_sizes = [16,32,64,128,256];
const generic_icon_size = 512;

module.exports = (grunt) => {
    grunt.registerTask('icons', 'Creates icons for all platforms', async function() {
        const done = this.async();
        
        mkdir('-p', iconset_folder);

        await sharp(icon_source)
            .resize(generic_icon_size, generic_icon_size)
            .toFile(generic_dest);

        let windows_png_tasks = windows_icon_sizes.map(async (size) => {
            return await sharp(icon_source)
                .resize(size, size)
                .png()
                .toBuffer();
        });

        let windows_pngs = await Promise.all(windows_png_tasks);
        let windows_ico = await to_ico(windows_pngs);
        
        await new Promise((resolve, reject) => {
            fs.writeFile(windows_ico_dest, windows_ico, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        if (process.platform === 'darwin') {
            for (let size of mac_icon_sizes) {
                let size_formatted = `${size}x${size}`;

                await sharp(icon_source)
                    .resize(size, size)
                    .toFile(path.join(iconset_folder, `icon_${size_formatted}.png`));
    
                await sharp(icon_source)
                    .resize((size * 2), (size * 2))
                    .toFile(path.join(iconset_folder, `icon_${size_formatted}@2x.png`));
            }

            await new Promise((resolve, reject) => {
                exec(`iconutil -c icns -o ${mac_icns_dest} ${iconset_folder}`, { async: true, silent: true }, (code, output) => {
                    if (code) {
                        return reject(new Error(`iconutils exited with a non-zero error code:\n${output}`));
                    }

                    resolve();
                });
            });

            rm('-rf', iconset_folder);
        }

        done();
    });
};