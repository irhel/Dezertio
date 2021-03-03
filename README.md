# Dezertio

Prototype of a multiplayer survival game inspired by Minecraft. Supports core elements of survival games like
hunting, crafting and PvP.

To run:

`npm install`

`node server.js`

then navigate to `http://localhost/`

### Demo Of The Game

https://user-images.githubusercontent.com/2095698/109862389-aad93b80-7c60-11eb-86ab-75f35573fe7f.mp4

### To do:

- [ ] Use [Spatial Hash Table](https://core.ac.uk/download/pdf/186700369.pdf) for very fast collision detection
- [ ] Use `MessagePack` to minimize data packets sent between client and server
- [ ] Use [ws](https://github.com/websockets/ws) instead of `socket.io` for bidirectional communication
- [ ] Client side prediction for smoother gameplay

