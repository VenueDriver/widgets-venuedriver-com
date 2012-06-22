require 'rubygems'
require 'fog'
require 'yaml'
require 'htmlentities'

module Deploy

  # This method deploys this project to Amazon S3, at http://widgets.venuedriver.com
  def deploy
    
    generate_example
    
    # Get the Amazon S3 configuration from the format that we have standardized at Venue Driver.
    s3config = YAML::load_file('config/aws.yml')

    connection = Fog::Storage.new(
      :provider                 => 'AWS',
      :aws_secret_access_key    => s3config['development']['secret_access_key'],
      :aws_access_key_id        => s3config['development']['access_key_id']
    )

    @bucket = connection.directories.create(
      :key => s3config['development']['bucket'],
      :public => true
    )
    @source = './public/'

    upload_file('/') # '/' is the path relative to the root of the @source.
    
  end
  
  # Copy the /demo.html file to an example.html file that shows the JavaScript code.
  def generate_example
    demo_file = ''; File.open('public/AccountEventsWidget/demo.html').lines.each do |line|
      demo_file << line.gsub(/^(.*\').*(\'\;\s*\/\/example.*)$/) { "#{$1}#{$2}" }
    end
    
    example_template = File.open('public/example_template.html').read
    File.open('public/AccountEventsWidget/example.html', 'w') do |example|
      example.puts example_template.gsub(/\<\%\s*YIELD\s*\%\>/m, HTMLEntities.new.encode(demo_file))
    end
  end

private

  def upload_file(path)
    file_path = File.join(@source, path)
    
    if File.directory? File.open(file_path)
      upload_directory(path)
    else
      @bucket.files.create(
        :key => target_path = path.gsub(/^\//,''),
        :body => File.open(file_path),
        :public => true
      )
      puts "Copied to S3: #{target_path}"
    end
  end

  def upload_directory(path)
    Dir.entries(File.join(@source, path)).each do |file|
      next if file =~ /\A\./
      if File.directory? File.open(File.join(@source, path, file))
        puts "Uploading directory: #{file}"
        upload_directory(File.join(path, file))
      else
        upload_file(File.join(path, file))
      end
    end
  end

end