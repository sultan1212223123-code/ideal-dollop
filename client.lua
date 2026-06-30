local phoneOpen = false
local players = {}

-- تحديث قائمة اللاعبين
Citizen.CreateThread(function()
    while true do
        Wait(1000)
        local playerList = GetPlayers()
        players = {}
        for i = 1, #playerList do
            local serverId = playerList[i]
            local name = GetPlayerName(serverId)
            table.insert(players, {
                id = serverId,
                name = name
            })
        end
    end
end)

-- الضغط على زر K لتشغيل الهاتف
Citizen.CreateThread(function()
    while true do
        Wait(0)
        
        if IsControlJustReleased(0, GetHashKey('k')) then
            phoneOpen = not phoneOpen
            if phoneOpen then
                SetNuiFocus(true, true)
                SendNUIMessage({ 
                    action = "show",
                    players = players
                })
            else
                SetNuiFocus(false, false)
                SendNUIMessage({ action = "hide" })
            end
        end
    end
end)

RegisterNUICallback('closePhone', function(data, cb)
    phoneOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('getPlayers', function(data, cb)
    cb(players)
end)

RegisterNUICallback('adminAction', function(data, cb)
    local action = data.action
    local targetId = data.targetId
    local message = data.message or ""
    
    if action == "kick" and targetId then
        TriggerServerEvent('admin:kick', targetId, message)
    elseif action == "ban" and targetId then
        TriggerServerEvent('admin:ban', targetId, message)
    elseif action == "announcement" then
        TriggerServerEvent('admin:announcement', message)
    elseif action == "teleport" and targetId then
        TriggerServerEvent('admin:teleport', targetId)
    elseif action == "freeze" and targetId then
        TriggerServerEvent('admin:freeze', targetId)
    elseif action == "warn" and targetId then
        TriggerServerEvent('admin:warn', targetId, message)
    end
    
    cb('ok')
end)