require 'sinatra'
require 'sinatra/cors'
require 'json'
require 'faye/websocket'

set :server, 'puma'
set :sockets, []
set :bind, '0.0.0.0'

set :allow_origin, ["http://localhost", "http://localhost:3000"]
set :allow_methods, "GET"
set :allow_headers, "content-type,if-modified-since"
set :expose_headers, "location,link"
set :allow_credentials, true

username = ENV['USERNAME']
is_model_open = false

get '/' do
  "VRX"
end

get '/texture' do
    texture = params['texture']
    entity_attr = params['touch']
    puts texture
    puts entity_attr

    File.open("C:\\Users\\#{username}\\AppData\\Roaming\\SketchUp\\SketchUp 2021\\SketchUp\\Plugins\\command.txt", 'w') do |file|
      file.puts "Sketchup::VRX::CustomizeModel.apply_texture('#{texture}.png', '#{entity_attr}')"
    end
end

get '/update' do
  project = params['project']
  view = params['view']
  File.open("C:\\Users\\#{username}\\AppData\\Roaming\\SketchUp\\SketchUp 2021\\SketchUp\\Plugins\\command.txt", 'w') do |file|
    file.puts "Sketchup::VRX::Screenshot.screenshot_sketchup('#{project}', '#{view}')"
  end
end

get '/open_sketchup' do
  project = params['project']
  sketchup_path = "C:\\Program Files\\SketchUp\\SketchUp 2021\\SketchUp.exe"
  skp_file_path = "C:\\Users\\#{username}\\AppData\\Roaming\\SketchUp\\SketchUp 2021\\SketchUp\\Plugins\\enviroments\\#{project}.skp\""
  system("start \"\" \"#{sketchup_path}\" \"#{skp_file_path}\"")
end

get '/close_sketchup' do
  system("taskkill /IM SketchUp.exe /F")
  is_model_open = false
end

get '/set_model_open' do
  is_model_open = params['is_model_open']
end

get '/is_model_open' do
  sketchup_process_name = "SketchUp.exe"
  process_list = `tasklist`
  unless process_list.include?(sketchup_process_name)
    is_model_open = false
  end
  if is_model_open
    body 'true'
  else
    body 'false'
  end
end