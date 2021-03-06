module.exports = function( grunt ) {

    grunt.initConfig({

        version: grunt.file.readJSON('package.json').version,

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            build: {
                src: ['Gruntfile.js', 'tasks/*.js']
            },
            src: {
                src: 'src/**/*.js'
            },
            test: {
                src: 'test/*/specs/*.js'
            }
        },

        mocha: {
            test: {
                src: ['test/unit/runner.html'],
                options: {
                    log: true,
                    run: true
                }
            }
        },

        watch: {
            options: {
                nospawn: true
            },
            dev: {
                files: ['src/**/*.js', './component.json'],
                tasks: ['dev', 'instrument']
            }
        }

    })

    grunt.loadNpmTasks('grunt-mocha')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-jshint')

    // load custom tasks
    grunt.file.recurse('tasks', function (path) {
        require('./' + path)(grunt)
    })

    grunt.registerTask( 'unit', [
        'instrument',
        'mocha'
    ])

    grunt.registerTask( 'test', [
        'unit',
        'casper'
    ])

    // 我添加的
    // grunt.registerTask( 'unit', [
    //     'unit'
    // ])

    grunt.registerTask( 'default', [
        'jshint',
        'build',
        'test'
    ])
    
}