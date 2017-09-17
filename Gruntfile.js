var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig({
   lambda_invoke: {
      default: {
         options: {
            file_name: 'index.js'
         }
      }
   },
   lambda_deploy: {
      default: {
         arn: 'arn:aws:lambda:us-east-1:508557115007:function:Travel_Agent'
      }
   },
   lambda_package: {
      default: {
   }
   }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])