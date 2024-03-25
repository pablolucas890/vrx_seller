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

get '/' do
  "VRX"
end

get '/texture' do
    texture = params['texture']
    entity_attr = params['touch']
    puts texture
    puts entity_attr

    # TODO: Remove Amoradev and set Username
    File.open('C:\Users\Amoradev\AppData\Roaming\SketchUp\SketchUp 2021\SketchUp\Plugins\command.txt', 'w') do |file|
      file.puts "Sketchup::VRX::CustomizeModel.apply_texture('#{texture}.png', '#{entity_attr}')"
    end
end

get '/update' do
  project = params['project']
  view = params['view']
  # TODO: Remove Amoradev and set Username
  File.open('C:\Users\Amoradev\AppData\Roaming\SketchUp\SketchUp 2021\SketchUp\Plugins\command.txt', 'w') do |file|
    file.puts "Sketchup::VRX::Screenshot.screenshot_sketchup('#{project}', '#{view}')"
  end
end

get '/open_sketchup' do
  project = params['project']
  sketchup_path = "C:\\Program Files\\SketchUp\\SketchUp 2021\\SketchUp.exe"
  # TODO: Remove Amoradev and set Username
  skp_file_path = "C:\\Users\\Amoradev\\AppData\\Roaming\\SketchUp\\SketchUp 2021\\SketchUp\\Plugins\\enviroments\\#{project}.skp\""
  system("start \"\" \"#{sketchup_path}\" \"#{skp_file_path}\"")
end

get '/close_sketchup' do
  system("taskkill /IM SketchUp.exe /F")
end
