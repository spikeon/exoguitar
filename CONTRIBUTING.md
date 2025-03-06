# Contributing

To contribute to this project you need to follow these rules: 
- All pieces must attach to the 2020 extrusion without needing to change their positions. 
- All pieces must fit on a 256x256x256 build volume
- You must provide a .3mf file that's properly laid out, supported, and in ABS

You must add Assembly Documentation for your part in ASSEMBLY.md and a BOM.txt file containing all parts necessary for the build.  

You should have photos of the piece in `/photos/` and exploded views in `/exploded views/` that show how the parts should be put together. 

Please follow the file structure already in place in your PR. 

To add it to this project, please fork this project and then submit a PR to me with the files in it.  

This project was built in OnShape and you are welcome to copy the it as a starting point for your build.  [Check it out here!](https://cad.onshape.com/documents/f8519e054e386d34fe7f717c/w/4b68044692bbe5e682fcb1e9/e/030bc3a27bf0944a8a68be66?renderMode=0&uiState=67c742332bca82445e94f5f6).  While I am providing this as a resource, I am not apologizing for how disorganized or inefficient it may be.  This is a passion project I've been doing in my spare time.  

## Interface .step file

I am providing an interface here that includes the 2020 extrusions, shoulder, faceplate, and bridge plate.  You should be able to import this into any CAD program you want and then design your parts off of this.  

[Interface File](/models/Extras/Interface/Interface.step)

## Wing Sets

Wing sets should include options for solid-face and hollow if possible.  
Wings should be 50mm thich where they meet the extrusion and should attach with at least 2 M5x10 bolts per piece
The M5 bolts should be positioned 10mm from the center of the hole to the bottom of the piece.  
If there isn't 100mm of clearance above the M5 bolt to get a screw driver in there to tighten the bolt, then a 12mm hole needs to be put in the side of the piece to allow for access.   If you feel so inclined you can provide plugs that users can glue in after the fact. 

If you are designing for the Offset Neck, you need to plan for at least 250mm of 2020 extrusion on the left side and 200mm on the right side.  
If you are designing for the Paralell neck, you need to plan for at least 250mm of 2020 extrusion on both sides. 

You are free to extend the size of the extrusion needed, but you cannot reduce it. 

You will need to have a Left Side, a Right Side, and a middle.  The middle must line up with the 2020 extrusion.  This is so if someone is building with a longer or shorter bridge than the basic thru-body they would only have to change one part rather than the entire wing set.  

## Bridge

I have provided a [blank template file](/models/Bridge/Blank/) that you can use as a starting point to create your own bridge.  

## Head

I have provided a [blank template file](/models/Head/Blank/ExoGuitar%20-%20Head%20-%20Blank.step) that you can use as a starting point to create your own bridge.  It includes the 2020 mount points, the battery + switch, and the Adjustable Nut; this way you can focus on just creating the styled head of your dreams.  

