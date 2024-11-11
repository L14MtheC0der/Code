import {Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, CubeTexture, PBRMaterial, SceneLoader, AbstractMesh, ActionManager, SetValueAction, InterpolateValueAction, IncrementValueAction} from "@babylonjs/core"

import "@babylonjs/loaders"

export class PBR {

    scene: Scene
    engine: Engine
    cube!: AbstractMesh
    sphere!:AbstractMesh
    cylinder!:AbstractMesh
    sphereMat!: PBRMaterial

    

    constructor( private canvas:HTMLCanvasElement){
        this.engine =new Engine(this.canvas, true)
        this.scene = this.CreateScene()
        
        this.CreateModel()
        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })

        
    }



    CreateScene():Scene {
        const scene = new Scene(this.engine)
        const camera = new FreeCamera("camera", new Vector3(0,1,0),this.scene)
        camera.attachControl();
        camera.speed = .30

        camera.position.z = -9

        // const light = new HemisphericLight("hemiLight",new Vector3(0,1,0), this.scene)

        // light.intensity = 0

        const envTex = CubeTexture.CreateFromPrefilteredData('./PBR/SKy.env',scene)

        scene.environmentTexture = envTex

        scene.createDefaultSkybox(envTex, true)

        scene.environmentIntensity = 2

        // const ground = MeshBuilder.CreateGround("Ground", {width:15, height:15}, this.scene)

        // ground.position.z =5

        

        // const ball = MeshBuilder.CreateSphere("ball", {diameter:2}, this.scene)
        // ball.position.z = 8
        // ball.position.y = 1


        // ground.material = this.CreateAsphalt()
        // ball.material = this.CreateBallMaterial()

        return scene
    }

    // CreateGroundMaterial():StandardMaterial{
    //     const groundMat = new StandardMaterial("GroundMat", this.scene)

    //     const uvScale = 3.75

        

    //     const texArray: Texture[] = []
        

    //     const diffuseTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_diff_1k.jpg", this.scene)

        
        

    //     groundMat.diffuseTexture = diffuseTex
        
    //     texArray.push(diffuseTex)

    //     const normalTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_nor_gl_1k.jpg", this.scene)

    //     groundMat.bumpTexture = normalTex

    //     texArray.push(normalTex)


    //     // const aoTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_ao_1k.jpg", this.scene)
    //     // groundMat.ambientTexture = aoTex
    //     // texArray.push(aoTex)

    //     const dispTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_disp_1k.jpg", this.scene)
        
    //     groundMat.specularTexture = dispTex

    //     texArray.push(dispTex)

    //     texArray.forEach((tex)=>{
    //         tex.uScale = uvScale
    //         tex.vScale = uvScale
            
    //     })

    //     return groundMat
    // }

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

    CreateAsphalt(): PBRMaterial{
        const pbr = new PBRMaterial('pbr', this.scene)

        pbr.albedoTexture = new Texture("./Textures/asphalt_02_1k.blend/textures/asphalt_02_diff_1k.jpg",this.scene)     
        
        pbr.bumpTexture = new Texture("./Textures/asphalt_02_1k.blend/textures/asphalt_02_nor_gl_1k.jpg",this.scene)

        pbr.invertNormalMapX = true
        pbr.invertNormalMapY = true


        pbr.useAmbientOcclusionFromMetallicTextureRed = true

        pbr.useRoughnessFromMetallicTextureGreen = true

        pbr.useMetallnessFromMetallicTextureBlue = true

        pbr.metallicTexture = new Texture("./Textures/asphalt_02_1k.blend/textures/asphalt_02_arm_1k.jpg",this.scene)

        

       
        return pbr
    }

    async CreateModel():Promise<void>{

        
        
        const {meshes} = await SceneLoader.ImportMeshAsync("", "./models/", "gifts.glb",this.scene)

        this.cube = meshes[1]
        this.sphere = meshes[2]
        this.cylinder = meshes[3]

        const cyl = this.cylinder

        const cube = this.cube

        const sphere = this.sphere
        

        cyl.rotation = new Vector3(-Math.PI/4,0,0)

        sphere.material = this.CreateBallMaterial()

        const SM = sphere.material

        this.CreateActions()  
        
    }
    CreateActions(): void {

        const cyl = this.cylinder

        const cube = this.cube

        const sphere = this.sphere

        const Ren = this.scene

        sphere.material = this.CreateBallMaterial()

        const SM = sphere.material

        cube.actionManager = new ActionManager(this.scene)
        sphere.actionManager = new ActionManager(this.scene)
        cyl.actionManager = new ActionManager(this.scene)
        Ren.actionManager = new ActionManager(Ren)


        

        const CAM = cube.actionManager
        const RAM = Ren.actionManager
        const SAM = sphere.actionManager
        const ZAM = cyl.actionManager


        CAM.registerAction(new InterpolateValueAction(ActionManager.OnPointerOverTrigger,cube,"scaling", new Vector3(1.6,1.6,1.6)))?.then(new InterpolateValueAction(ActionManager.OnPointerOutTrigger,cube,"scaling", new Vector3(1,1,1)))

        SAM.registerAction(new InterpolateValueAction( ActionManager.OnPointerOverTrigger, SM, "metallic",100,1850))?.then(new InterpolateValueAction( ActionManager.OnPointerOutTrigger, SM, "metallic",0,1850))
        
        ZAM.registerAction(new InterpolateValueAction(ActionManager.OnPickDownTrigger, cyl,'rotation.x', 40,80000))?.then(new InterpolateValueAction(ActionManager.NothingTrigger, cyl,'rotation.y', 0,80000))
        ZAM.registerAction(new InterpolateValueAction(ActionManager.OnPickDownTrigger, cyl,'rotation.y', 40,80000))?.then(new InterpolateValueAction(ActionManager.NothingTrigger, cyl,'rotation.y', 0,80000))

        

        
    }
}