import {Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, CubeTexture} from "@babylonjs/core"

export class StandardMaterials {

    scene: Scene
    engine: Engine

    constructor( private canvas:HTMLCanvasElement){
        this.engine =new Engine(this.canvas, true)
        this.scene = this.CreateScene()
        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })
    }



    CreateScene():Scene {
        const scene = new Scene(this.engine)
        const camera = new FreeCamera("camera", new Vector3(0,1,0),this.scene)
        camera.attachControl();
        camera.speed = .30

        camera.position.z = 0

        const light = new HemisphericLight("hemiLight",new Vector3(0,1,0), this.scene)

        light.intensity = 1

        const ground = MeshBuilder.CreateGround("Ground", {width:15, height:15}, this.scene)

        ground.position.z =5

        const ball = MeshBuilder.CreateSphere("ball", {diameter:2}, this.scene)
        const ball2 = MeshBuilder.CreateSphere("ball", {diameter:2}, this.scene)
        ball.position.z = 8
        ball2.position.z = ball.position.z 
        ball.position.y = 1
        ball2.position.y =ball.position.y
        ball2.position.x= ball.position.x+1.5


        ground.material = this.CreateGroundMaterial()
        ball.material = this.CreateBallMaterial()
        ball2.material = this.CreateBallMaterial()

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

    CreateBallMaterial():StandardMaterial{
        const BallMat = new StandardMaterial("BallMat", this.scene)

       
        

        
        

        const uvScale = .5       

        const texArray: Texture[] = []
        

        const diffuseTex = new Texture(
            "./Textures/Metal plate/metal_plate_diff_1k.jpg"
        )
        
        

        BallMat.diffuseTexture = diffuseTex
        
        texArray.push(diffuseTex)

        const normalTex = new Texture("./Textures/Metal plate/metal_plate_nor_gl_1k.jpg", this.scene)

        BallMat.bumpTexture = normalTex
        BallMat.invertNormalMapX = true
        BallMat.invertNormalMapY = true
        texArray.push(normalTex)


        const aoTex = new Texture("./Textures/Metal plate/metal_plate_ao_1k.jpg", this.scene)
        BallMat.ambientTexture = aoTex
        texArray.push(aoTex)

        const specTex = new Texture("./Textures/Metal plate/metal_plate_spec_1k.jpg", this.scene)
        
        BallMat.specularTexture = specTex
        BallMat.specularPower = 90
        texArray.push(specTex)

        texArray.forEach((tex)=>{
            tex.uScale = uvScale
            tex.vScale = uvScale
            
        })


        return BallMat
        
    }

}