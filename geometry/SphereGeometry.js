import * as THREE from "https://cdn.skypack.dev/three@0.128.0";

class SphereGeometry extends THREE.BufferGeometry {

	constructor( radius = 1, widthSegments = 8, heightSegments = 6, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI ) {

		super();
		this.type = 'SphereGeometry';

		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		widthSegments = Math.max( 3, Math.floor( widthSegments ) );
		heightSegments = Math.max( 2, Math.floor( heightSegments ) );

		const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );

		let index = 0;
		const grid = [];

		const vertex = new THREE.Vector3();
		const normal = new THREE.Vector3();

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

        let randomRadius = 0;
        const origin_width_vertex = [];
        let trigger_top = 0;
        let trigger_bottom = 0;

		// generate vertices, normals and uvs

		for ( let iy = 0; iy <= heightSegments; iy ++ ) {

			const verticesRow = [];

			const v = iy / heightSegments;

			// special case for the poles

			let uOffset = 0;

			if ( iy == 0 && thetaStart == 0 ) {

				uOffset = 0.5 / widthSegments;

			} else if ( iy == heightSegments && thetaEnd == Math.PI ) {

				uOffset = - 0.5 / widthSegments;

			}

			for ( let ix = 0; ix <= widthSegments; ix ++ ) {

				const u = ix / widthSegments;

                randomRadius = Math.random()*0.5

				// vertex

                if ( ix != widthSegments ) {
                    vertex.x = - (radius + randomRadius) * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
                    vertex.y = (radius + randomRadius) * Math.cos( thetaStart + v * thetaLength );
                    vertex.z = (radius + randomRadius) * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
                } else if ( ix == widthSegments ) {
                    vertex.x = origin_width_vertex[0]
                    vertex.y = origin_width_vertex[1]
                    vertex.z = origin_width_vertex[2]
                }

                if ( ix == 0 ) {
                    origin_width_vertex[0] = vertex.x
                    origin_width_vertex[1] = vertex.y
                    origin_width_vertex[2] = vertex.z
                }

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normal.copy( vertex ).normalize();
				normals.push( normal.x, normal.y, normal.z );

				// uv

				uvs.push( u + uOffset, 1 - v );

				verticesRow.push( index ++ );

			}

			grid.push( verticesRow );

		}

		// indices

		for ( let iy = 0; iy < heightSegments; iy ++ ) {

			for ( let ix = 0; ix < widthSegments; ix ++ ) {

				const a = grid[ iy ][ ix + 1 ];
				const b = grid[ iy ][ ix ];
				const c = grid[ iy + 1 ][ ix ];
				const d = grid[ iy + 1 ][ ix + 1 ];

				if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
				if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );

			}

		}

		// build geometry

		this.setIndex( indices );
		this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

	}

}

export { SphereGeometry, SphereGeometry as SphereBufferGeometry };