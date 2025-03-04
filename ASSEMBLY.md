# Assembly

ExoGuitar is a complicated project.  It has a bunch of hardware and a bunch of different parts.  I hope you can understand how this can make documenting this a challenge, especially for a single person with a full-time job on top of a small business to run.  That being said; there are likely gaps in this documentation.  If you want to assist, it is EXTREMELY welcone for you to reach out. 

## Choosing your parts

Before you start printing an ExoGuitar, you need to decide which kind of guitar you are trying to build.  Do you want an electric or an accoustic?  Printed neck or wooden neck?  What body style do you want? Headless or Head?  Printed bridge or one off-the-shelf?

One day I hope I can have the time and resources to build a configurator.  For right now, however, this is a pretty manual process. 

There are 7 main parts that each have their own options:

1. [Shoulder](/models/Shoulders/)
    - Offset 
        - [ExoGuitar Neck](/models/Shoulders/Offset%20-%20ExoGuitar%20Neck/)
        - [Wood Neck](/models/Shoulders/Offset%20-%20Regular%20Neck/)
    - Paralell
        - [Wood Neck](/models/Shoulders/Parallel%20-%20Regular%20Neck/)
2. [Neck](/models/Neck/) - Note: you can skip this if you use a wooden neck
    - [Metal Frets](/models/Neck/Neck%20with%20Metal%20Frets/) - Note: this is a REALLY intensive build
    - [Printed Frets](/models/Neck/Neck%20with%20Printed%20Frets/)  - Note: I have only tested this with nylon strings; I make NO promises that it can handle metal strings or the forces that they apply. 
3. [Head](/models/Head/) - Note: you can skip this if you use a wooden neck
    - [Classical](/models/Head/Classical/ASSEMBLY.md) - Note: I have only tested this with nylon strings; I make NO promises that it can handle metal strings or the forces that they apply. 
    - [Regular](/models/Head/Head/)
    - [Headless](/models/Head/Headless%20Adjustable%20Nut/)
4. [Bridge](/models/Bridge/)
    - Headless 
        - [Headless for Bearing Bridge](/models/Bridge/Headless%20Bridge%20Plate/)
        - [Alnicov 6 Strings Saddle Headless](/models/Bridge/Alnicov%206%20Strings%20Saddle%20Headless/)
    - Head
        - [Thru-Body Bearing Bridge](/models/Bridge/Thru-Body%20Bridge%20Plate%20-%20Bearing%20Bridge/)
        - [Thru-Body for Tune-o-Matic](/models/Bridge/Thru-Body%20Bridge%20Plate%20-%20Tune-O-matic/)
        - [Blank](/models/Bridge/Blank/) - Note: this is a starting point for you to model your own bridge
5. [Face Plate](/models/Face%20Plates/)
    - [Acoustic](/models/Face%20Plates/Acoustic/)
    - [Dual Humbucker](/models/Face%20Plates/Dual%20Humbucker/)
    - [Single Humbucker](/models/Face%20Plates/Single%20Humbucker/)
    - [Telecaster](/models/Face%20Plates/Telecaster/)
    - [Stealth Plate](/models/Face%20Plates/StealthPlate/) - Note: This is an experimental face plate that covers the pickups with a thin piece of plastic that you can add decoration to.  It's fun but likely not the best sounding option. 
    - [Clip-in Compartment](/models/Face%20Plates/Clip-In%20Compartment/) - Note: This is my initial prototype face plate.  It is not recommended unless you want to swap faces often.
6. [Back](/models/Back/)
    Note: The accoustic face plate has it's own back as part of it's resonation chamber. 
    - [Screw On](/models/Back/Screw%20On/) - Do you want to be able to get to your electronics from the back?  This is the option for you
    - [Slide In](/models/Back/Slide%20In/) - Do you want to glue the back in place and access electronics from the front?  Use this one
7. [Wing Set](/models/Wing%20Sets/)
    The only thing you really need to worry about with the wing sets is if they will work with the shoulder you chose earlier.  
    - Offset Shoulder
        - [Banj-No](/models/Wing%20Sets/BanjNo/)
        - [Less Paul](/models/Wing%20Sets/Less%20Paul/)
        - [More Paul](/models/Wing%20Sets/More%20Paul/)
        - [Warlock](/models/Wing%20Sets/Warlock/)
        - [Explorer](/models/Wing%20Sets/Explorer/)
        - [Firebird](/models/Wing%20Sets/Firebird/)
        - [Rich](/models/Wing%20Sets/Rich/) - Note: Looks the best with the Headless Bridge Plate
        - [Venom](/models/Wing%20Sets/Venom/) - This is the Rich with spider webs in it.
    - Parallel Shoulder
        - [Training-V](/models/Wing%20Sets/Training-V/)
    - Both
        - [Cyber Butterfly](/models/Wing%20Sets/Cyber%20Butterfly/)
    
## Ordering your Hardware

Once you have picked your parts, get the BOM.txt file from each part and figure out how much of each part you need and then order them.  

## Begin Assembly

### Shoulder

I have found that it's easiest to start with the shoulder and then build out from there.  The first thing I would suggest doing is tapping the ends of all of your 2020 extrusion.  Some 2020 extrusion comes with a 5mm hole and some come with a 6mm hole, so make sure you tap it with the right size.  You will need to tap at least one end of each piece of extrusion depending on the parts you are using.  It may be a good idea to tap all of them; just in case.  

Note for those who have never tapped before:  Use cutting fluid.  Go SLOW.  Like slower than you think.  Go a few turns and then do at least one full rotation backwards, then repeat.  If you're using a drill, make sure to set it to like 6-7 so it won't snap your tap.  

Beyond this, follow the assembly guide in your chosen shoulder and then come back here

### Face Plate

Follow the assembly guide in your chosen face plate, and then come back here

### Bridge 

If you chose to do a Bearing Bridge, follow the assembly documentation in that and then come back here. 

Follow the assembly guide in your chosen bridge plate, then come back here.

### Wing Set

All wing sets follow a certain pattern, so I'll just describe it here in general for now. 
- If you are printing an electric you need to print the solid part with the electronics compartment and assemble that.  If you are printing an accoustic, you can print whatever part you feel makes it look coolest. 
- There should be blank files if you want a different knob / switch / User Interface setup than the one in the standard files. 
- The back of the electronics compartment will be held on by press-insert magnets.  Insert them into the body and then pop a magnet onto the ones you have inserted and then press the back onto those magnets to ensure that you have the correct polarity.  They should be press fit but if that doesn't work you can use super glue to hold them in
- All wing pieces attach to the sides of the 2020 extrusion using M5x10 BHCS bolts and M5 Slide in Nuts.  If there wasn't enough clearance to get a screw driver into the wing to tighten the bolt, a hole should've been added to the outside of the part to allow for access. 
- I recommend putting some super glue between the pieces when you attach them to the 2020 so that you reduce potential rattling or wiggle if any of the screws start to come out over time.
- I recommend when installing the electronics to put a disconnect on all wires going into the electronics compartment so if you need to change the wing set or the face plate you don't have to desolder anything. 
- Some wing sets have parts that are screwed to each other for stability.  See the BOM for the hardware needed for this.  

### Back
 - For the screw on backs, use slide-in nuts and the screws that the back requires to mount them to the 2020 extrusion. 
 - For the slide-in back, put in the pieces making sure that the holes allow access to the sections that need adjustment. 

### Head
- If you are using a wooden neck, you can skip this
- If you are using Nylon Strings, you want the classical Head.  

### Neck
 - If you chose to use a wooden neck, you can attach it to the shoulder using a metal neck plate and the basic wood screws that come with the neck plate. 
 - If you are using a printed neck, follow the assembly guide and then come back here. 

