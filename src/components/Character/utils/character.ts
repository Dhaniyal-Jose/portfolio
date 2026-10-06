import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isActive: () => boolean = () => true
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF | null> => {
    let blobUrl: string | undefined;
    try {
      const encryptedBlob = await decryptFile("/models/character.enc", "Character3D#@");
      if (!isActive()) return null;
      blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
      const gltf = await loader.loadAsync(blobUrl);
      if (!isActive()) {
        gltf.scene.traverse((child) => {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => {
              (material as THREE.MeshBasicMaterial).map?.dispose();
              material.dispose();
            });
          }
        });
        return null;
      }
      // Compile once at startup, without a polling task that can outlive the renderer.
      renderer.compile(gltf.scene, camera, scene);
      gltf.scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.frustumCulled = true;
        }
      });
      const footR = gltf.scene.getObjectByName("footR");
      const footL = gltf.scene.getObjectByName("footL");
      if (footR) footR.position.y = 3.36;
      if (footL) footL.position.y = 3.36;
      return gltf;
    } finally {
      dracoLoader.dispose();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    }
  };
  return { loadCharacter };
};
export default setCharacter;
