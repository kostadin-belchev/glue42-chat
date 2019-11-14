cd glue42-chat-client
copy  glue42-chat-client.json %localappdata%\Tick42\GlueDesktop\config\apps\
call npm cache clean --force
call npm install
echo "cd .."
cd ..
echo "cd glue42-chat-provider"
cd glue42-chat-provider
echo "copy glue42-chat-provider.json %localappdata%\Tick42\GlueDesktop\config\apps\"
copy glue42-chat-provider.json %localappdata%\Tick42\GlueDesktop\config\apps\
echo "npm install"
call npm install
PAUSE