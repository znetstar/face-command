module.exports = (grunt) => {
    require('./grunt/icons')(grunt);
    require('./grunt/packager')(grunt);
    require('./grunt/zipper')(grunt);

    grunt.config.init({
        'packager': {

        },
        clean: ["lib", "dist", "build"],
        ts: {
            default : {
              outDir: "lib",
              tsconfig: './tsconfig.json'
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build-ts', ["clean", 'ts']);

    grunt.registerTask('build', ["clean", 'build-ts', 'icons', 'packager']);
    grunt.registerTask('build-all', ["clean", 'build-ts', 'icons', 'packager:all']);
    grunt.registerTask('dist', ['build', 'zipper']);
    grunt.registerTask('dist-all', ['build-all', 'zipper']);
    grunt.registerTask('default', ['build']);
};