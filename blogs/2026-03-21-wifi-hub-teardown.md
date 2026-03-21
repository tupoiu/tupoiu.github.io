## What I learned dissecting my Wifi disc

I took a day off on friday and we had a spare Wifi disc in the living room, so I decided to try dissecting it to see what would happen.

### Initial physical teardown

The disc was split into 2 plastic parts with lots of scaffolding pieces on each of them. I noticed on the back that there's a keyhole mount so you could actually hang the hub from a screw or nail if you want (although the ethernet would sit against the wall in that case). Popping these apart took a second - I tried a little knitting needle, then a guitar pick, then a screwdriver to pop the clips that were spaced around the disc between the 2 pieces.

Once it was in two, the rest was easy - philips screws and just gently pulling apart and removing the heatsink - the PCB was sandwiched between 2 metal plates, one with heatsink "channels" and the other flat (apart from a square dimple), with a grey paste (I assume thermal paste) stucking each of them to various parts of the board like what I found out later was the memory chip.

### What's on the board?

<img src="assets/wifi-router-innards.jpg" style="object-fit: cover">

The first thing I noticed were the 4 PCB antennae all aiming in different directions. These are connected up with cables that have little gold coloured connectors on the end. There's obviously the ethernet port, which is connected by 8 pins (they solder 4 each way, alternating like up/down/up/down/...), and a 12V/2A DC power supply (marked with a solid line with a dashed line under it, AC is marked with ~). There's also a "network transformer" module (UTG24T03) for the ethernet. Apparently ethernet uses the difference between the voltages on TX+ and TX- for its communication. The SoCs were covered by metal shields so I couldn't get access to them.

### Communicating with the board

I downloaded WireShark and plugged the ethernet cable into my laptop. The router was using a proprietary protocol, but I did manage to get its MAC address and find out that it (or at least the network interface) was made by Arcadyan (Taiwanese company).

### Conclusion

Interesting little escapade. A lot of competence is familiarity. I tried to find out if I could flash the device to make it run linux, but I think there wasn't an easy way. They must've flashed it somehow but I couldn't figure it out (there was no UART that I could find on the board) so I'm stopping here for now.