local phoneOpen = false

-- الضغط على زر K لتشغيل الهاتف
Citizen.CreateThread(function()
    while true do
        Wait(0)
        
        if IsControlJustReleased(0, GetHashKey('k')) then
            phoneOpen = not phoneOpen
            if phoneOpen then
                SetNuiFocus(true, true)
                SendNUIMessage({ action = "show" })
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

RegisterNUICallback('adminAction', function(data, cb)
    local action = data.action
    
    if action == "kick" then
        TriggerServerEvent('admin:kick')
    elseif action == "ban" then
        TriggerServerEvent('admin:ban')
    elseif action == "announcement" then
        TriggerServerEvent('admin:announcement')
    elseif action == "teleport" then
        TriggerServerEvent('admin:teleport')
    end
    
    cb('ok')
end)