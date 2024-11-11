import {Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder} from "@babylonjs/core"

export class BasicScene {

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

        camera.position.z = 0

        const light = new HemisphericLight("hemiLight",new Vector3(0,1,0), this.scene)

        light.intensity = 2

        const ground = MeshBuilder.CreateGround("Ground", {width:15, height:15}, this.scene)

        ground.position.z =0

        const ball = MeshBuilder.CreateSphere("ball", {diameter:2}, this.scene)

        ball.position.z = 0
        return scene
    }
}