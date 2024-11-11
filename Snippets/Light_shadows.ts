import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    SceneLoader,
    AbstractMesh,
    GlowLayer,
    LightGizmo,
    GizmoManager,
    Light,
    Color3,
    DirectionalLight,
    PointLight,
    SpotLight,
    ShadowGenerator
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
  
  export class LightScene {
    scene: Scene;
    engine: Engine;
    loadingScreen:CustomLoadingScreen;
    lightTubes!: AbstractMesh[];
    models!: AbstractMesh[];
    ball!: AbstractMesh;
  
    constructor(private canvas: HTMLCanvasElement, private loadingBar: HTMLElement, private percentLoaded: HTMLElement, private loader: HTMLElement) {
      this.engine = new Engine(this.canvas, true);
      
      this.loadingScreen = new CustomLoadingScreen(this.loadingBar,this.percentLoaded, this.loader)

      this.engine.loadingScreen = this.loadingScreen

      this.engine.displayLoadingUI()
      this.scene = this.CreateScene();
      this.CreateEnvironment();
  
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);
      const camera = new FreeCamera("camera", new Vector3(0, 1, -4), this.scene);
      camera.attachControl();
      camera.speed = 0.2;
  
      return scene;
    }
  
    async CreateEnvironment(): Promise<void> {
      const { meshes } = await SceneLoader.ImportMeshAsync(
        "",
        "./Models/",
        "LightingScene.glb"
      );
  
      this.models = meshes;
  
      this.lightTubes = meshes.filter(
        (mesh) =>
          mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
      );
  
      this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
  
      this.ball.position = new Vector3(0, 1, -1);
  
      const glowLayer = new GlowLayer("glowLayer", this.scene);
      glowLayer.intensity = 0.75;

      this.CreateLights()
    }

    CreateLights(): void{
        // const hemiLight =  new HemisphericLight("Hemilight", new Vector3(0,1,0), this.scene)

        // hemiLight.diffuse = new Color3(.8,.0,.05)
        
        // hemiLight.groundColor = new Color3(.9,.46,.0)
        
        // hemiLight.specular = new Color3(0,0,.6)

        // hemiLight.intensity = 2

        // const directionalLight = new DirectionalLight("DirLight", new Vector3(0,-1,0),this.scene)

        // directionalLight.diffuse = new Color3(.9,.46,.0)
        
        // directionalLight.specular = new Color3(0,0,.6)

        // directionalLight.intensity = 1


        const spotLight = new SpotLight("spotLight", new Vector3(0,3,-2),new Vector3(0,-7,3),Math.PI/4,35, this.scene)

       spotLight.diffuse = new Color3(.1,.6,1)
       spotLight.specular = new Color3(.1,.6,1)
       spotLight.intensity = 10

       spotLight.shadowEnabled = true

       spotLight.shadowMinZ =.01
       spotLight.shadowMaxZ =100

       const ShadowGen = new ShadowGenerator(3072, spotLight,)
       ShadowGen.useBlurCloseExponentialShadowMap = true


       this.ball.receiveShadows = true
       ShadowGen.addShadowCaster(this.ball)
       
       this.models.map(mesh=>{
        mesh.receiveShadows = true
        ShadowGen.addShadowCaster(mesh)
       })


        const pointLight = new PointLight("Point", new Vector3(0,1,0), this.scene)
        pointLight.diffuse = new Color3(.1,.3,1)
        pointLight.specular = new Color3(0,0,.86)
        pointLight.intensity = .4
        pointLight.shadowEnabled = true
        const pointClone2 = pointLight.clone("pointClone") as PointLight;
        const pointClone3 = pointLight.clone("pointClone") as PointLight;
        const pointClone4 = pointLight.clone("pointClone") as PointLight;
        pointLight.parent = this.lightTubes[0]
        pointClone2.parent = this.lightTubes[1]
        pointClone3.parent = this.lightTubes[0]
        pointClone4.parent = this.lightTubes[1]

        



       
       this.engine.hideLoadingUI()
    }
  
    
  }