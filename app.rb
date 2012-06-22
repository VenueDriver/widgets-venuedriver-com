require 'rubygems'
require 'sinatra'
require 'json'
require 'haml'
require 'uri'

begin
  # Require the preresolved locked set of gems.
  require ::File.expand_path('../.bundle/environment', __FILE__)
rescue LoadError
  # Fallback on doing the resolve at runtime.
  require "rubygems"
  require "bundler"
  Bundler.setup
end

set :public_folder, File.join(File.dirname(__FILE__), 'public')
set :views,         File.join(File.dirname(__FILE__), '/app/views/')

get '/' do
  redirect "/index.html"
end

get '/index' do
  redirect "/index.html"
end

get '/cal' do
  redirect "/CalendarEventsWidget/demo.html"
end

#commit this
