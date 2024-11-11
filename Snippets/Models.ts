import {Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, CubeTexture, PBRMaterial, SceneLoader} from "@babylonjs/core"
import "@babylonjs/loaders"
export class Models {

    scene: Scene
    engine: Engine

    constructor( private canvas:HTMLCanvasElement){
        this.engine =new Engine(this.canvas, true)
        this.scene = this.CreateScene()
        // this.CreateBarrel()
        // this.CreateAsphalt()
        //this.CreateGroundMaterial()
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

        camera.position.z = -5

        // const light = new HemisphericLight("hemiLight",new Vector3(0,1,0), this.scene)

        // light.intensity = 0

        const envTex = CubeTexture.CreateFromPrefilteredData('./PBR/SKy.env',scene)

        scene.environmentTexture = envTex

        scene.createDefaultSkybox(envTex, true)

        scene.environmentIntensity = .62

        // const ground = MeshBuilder.CreateGround("Ground", {width:15, height:15}, this.scene)

        // ground.position.z =0

        
        

        // ground.material = this.CreateAsphalt()
        

        return scene
    }

    CreateGroundMaterial():StandardMaterial{
        const groundMat = new StandardMaterial("GroundMat", this.scene)

        const uvScale = 3.75

        

        const texArray: Texture[] = []
        

        const diffuseTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_diff_1k.jpg", this.scene)

        
        

        groundMat.diffuseTexture = diffuseTex
        
        texArray.push(diffuseTex)

        const normalTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_nor_gl_1k.jpg", this.scene)

        groundMat.bumpTexture = normalTex

        texArray.push(normalTex)


        // const aoTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_ao_1k.jpg", this.scene)
        // groundMat.ambientTexture = aoTex
        // texArray.push(aoTex)

        const dispTex = new Texture("./Textures/CobbleStone/patterned_cobblestone_02_disp_1k.jpg", this.scene)
        
        groundMat.specularTexture = dispTex

        texArray.push(dispTex)

        texArray.forEach((tex)=>{
            tex.uScale = uvScale
            tex.vScale = uvScale
            
        })

        return groundMat
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

    async CreateBarrel() :Promise<void>{
        // SceneLoader.ImportMesh("","./models/","round.glb",this.scene,(meshes)=>{console.log('meshes', meshes)} )
        
        const {meshes} = await SceneLoader.ImportMeshAsync("", "./models/",  "round.glb")

        

        console.log("models", meshes)

    }


    async CreateModel():Promise<void>{
        const models = await SceneLoader.ImportMeshAsync("", "./models/", "forest.glb")
    }
}