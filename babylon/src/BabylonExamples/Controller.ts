import {Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, CubeTexture, PBRMaterial, SceneLoader, AbstractMesh, ActionManager, SetValueAction, InterpolateValueAction, IncrementValueAction, Mesh, CannonJSPlugin, PhysicsImpostor, Size, Color3, int} from "@babylonjs/core"

import "@babylonjs/loaders"

import * as CANNON from "cannon"

export class FpController {

    scene: Scene
    engine: Engine
    box!: AbstractMesh
    sphere!:AbstractMesh
    cylinder!:AbstractMesh
    ground!:AbstractMesh
    sphereMat!: PBRMaterial
    x: int

    

    constructor( private canvas:HTMLCanvasElement){

        this.x = Math.floor( Math.random() * 2) +1;

        this.engine =new Engine(this.canvas, true)
        this.scene = this.CreateScene()

        
        if (this.x === 2){
            this.CreateEnvironment()
        }
        if (this.x === 1){
            this.CreateEnvironment2()
            this.CreateEnvironment3()

        }  
        
        
        
        

        

        // this.CreateImposter()

        this.CreateController()

        // this.Triggered()
        
        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })

        
    }



    CreateScene():Scene {
        const scene = new Scene(this.engine)
        
        const light = new HemisphericLight("hemiLight",new Vector3(0,1,0), this.scene)

        light.intensity = 5

        scene.onPointerDown =  (evt)=>{

            if(evt.button === 0) this.engine.enterPointerlock()

            if(evt.button === 1) this.engine.exitPointerlock()


        }
         

        const FPS = 60

        const gravity = -9.81

        scene.gravity = new Vector3(0, FPS/gravity,0)

        scene.collisionsEnabled = true

        scene.enablePhysics(new Vector3(0,-9.81,0), new CannonJSPlugin(true,10,CANNON))



        // const ground = MeshBuilder.CreateGround("Ground", {width:15, height:15}, this.scene)

        // ground.position.z =5

        

        // const ball = MeshBuilder.CreateSphere("ball", {diameter:2}, this.scene)
        // ball.position.z = 8
        // ball.position.y = 1

        // ball.checkCollisions = true


        
        // ball.material = this.CreateBallMaterial()

        return scene
    }
   
    CreateBallMaterial():PBRMaterial{
        const pbr = new PBRMaterial("pbr",this.scene)

        pbr.albedoTexture = new Texture("./Textures/Metal plate/metal_plate_diff_1k.jpg",this.scene)

        pbr.bumpTexture = new Texture("./Textures/Metal plate/metal_plate_nor_gl_1k.jpg", this.scene)

        pbr.invertNormalMapX = true
        pbr.invertNormalMapY = true

        pbr.useAmbientOcclusionFromMetallicTextureRed = true
        pbr.useRoughnessFromMetallicTextureGreen = true
        pbr.useMetallnessFromMetallicTextureBlue = true


        pbr.metallicTexture = new Texture("./Textures/Metal plate/metal_plate_arm_1k.jpg", this.scene)


        return pbr 
        
    }

    async CreateEnvironment(): Promise<void> {
        const { meshes } = await SceneLoader.ImportMeshAsync(
          "",
          "./Models/",
          "round.glb",
          this.scene
        );

        

        meshes.map(mesh=>{
            mesh.checkCollisions = true
        })

    }
    async CreateEnvironment3(): Promise<void> {
        


    

        const { meshes } = await SceneLoader.ImportMeshAsync(
          "",
          "./Check/",
          "Cube.glb",
          
          this.scene
        );

        console.log("Cube",{meshes})
        
        

        meshes.map(mesh=>{
            mesh.checkCollisions = true

            

        
        })

    }

    async CreateEnvironment2(): Promise<void> {
        


    

        const { meshes } = await SceneLoader.ImportMeshAsync(
          "",
          "./Check/",
          "theater.glb",
          
          this.scene
        );

        console.log("meshes",{meshes})
        
        

        meshes.map(mesh=>{
            mesh.checkCollisions = true

            

        //    const mam = mesh.actionManager

        //     mam?.registerAction(new InterpolateValueAction(ActionManager.OnPointerOverTrigger,camera,"position", new Vector3(mesh.position.x,mesh.position.y,mesh.position.z)))
        })

    }

    CreateController():void {
        const camera = new FreeCamera("camera", new Vector3(0,5,-7), this.scene)
        camera.attachControl()

        camera.speed = .5

        camera.angularSensibility =4500


        camera.applyGravity = true

        camera.checkCollisions = true

        camera.ellipsoid = new Vector3(1,.7,1)

        camera.minZ = 0.55
        
        

    
        

        

        camera.keysUp.push(87)
        camera.keysLeft.push(65)
        camera.keysDown.push(83)
        camera.keysRight.push(68)
        
    }



    // CreateImposter(): void{
    //     this.sphere = MeshBuilder.CreateSphere("sphere", {diameter:2})
        
    //     this.sphere.checkCollisions =true

    //     this.sphere.position = new Vector3(0,7,0)

    //     this.sphere.physicsImpostor = new PhysicsImpostor(this.sphere,PhysicsImpostor.SphereImpostor, {mass:1,friction:1,restitution:.7})

        
        
        

    //     // this.box = MeshBuilder.CreateBox("box", {size:1, updatable:true})

    //     // this.box.checkCollisions =true

    //     // this.box.physicsImpostor = new PhysicsImpostor(this.box,PhysicsImpostor.BoxImpostor, {mass:1,friction:1,restitution:1.1})

        

    //     // this.box.position = new Vector3(0,1,0)

    //     this.ground = MeshBuilder.CreateGround("ground", {width:45,height:45})

    //     this.ground.isVisible = false
    //     this.ground.position = new Vector3(0,.3,0)

    //     this.ground.physicsImpostor = new PhysicsImpostor(this.ground,PhysicsImpostor.BoxImpostor, {mass:0,friction:5,restitution:1.2})


    //     // this.box.physicsImpostor.registerOnPhysicsCollide(this.sphere.physicsImpostor,this.DetectCollisions)

    //     // this.sphere.physicsImpostor.registerOnPhysicsCollide(this.box.physicsImpostor,this.DetectCollisions)
    //     // this.sphere.physicsImpostor.unregisterOnPhysicsCollide( this.ground.physicsImpostor,this.DetectCollisions)

    // }

    // DetectCollisions(BoxCol:PhysicsImpostor, ColAgainst:any):void {


    //     const matty = new StandardMaterial("matty", this.scene)
    //     matty.diffuseColor = new Color3(.78,.03,.09);
    //     const matty2 = new StandardMaterial("matty", this.scene)
    //     matty2.diffuseColor = new Color3(.08,.3,.9);



    //     // BoxCol.object.scaling = new Vector3 (2,2,2)

    //     // BoxCol.setScalingUpdated()


    //     (ColAgainst.object as AbstractMesh).material = matty;

    //     // (BoxCol.object as AbstractMesh).material = matty2;

    // }

    // Triggered():void{

    //     const box = MeshBuilder.CreateBox("box", {width:2, height: 1,depth:2})

    //     const Mat =  new StandardMaterial("red",this.scene)

    //     Mat.diffuseColor = new Color3(.4,.5,.75)

    //     box.position.y = .5

    //     box.visibility = .35

    //     let counter = 0;

        



    //     this.scene.registerBeforeRender(()=>{
    //         if(box.intersectsMesh(this.sphere)) counter++;
    //         if (counter >103)this.sphere.material = Mat
    //         if (counter >105)this.sphere.scaling = new Vector3(2,2,2)
            
    //     })


        

        

        

        



    // }

}