require 'rubygems'

begin
  load File.dirname(__FILE__) + '/jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

desc "Deploy an update to Amazon S3."
task :deploy do
  require 'lib/deploy.rb'
  include Deploy
  deploy
end

desc "Generate encoded markup for example code pages. "
task :generate do 
  require 'lib/deploy.rb'
  include Deploy
  generate_example
end  