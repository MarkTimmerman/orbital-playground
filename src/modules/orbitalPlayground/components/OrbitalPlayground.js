import {buildSvgElement} from 'modules/svgElements/systems';
import {updateBodies} from 'modules/bodies/systems';
import {Background} from 'modules/orbitalPlayground/components';
import {initializeKeyListeners} from 'modules/orbitalPlayground/systems';
import {Earth, Spaceship, SpaceStation} from 'modules/bodies/components';
import {Perspective} from 'modules/perspective/components';
import {
    updatePerspectiveNode,
    updateBodyNodesInPerspective,
} from 'modules/perspective/systems';

export default function OrbitalPlayground(props) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = buildSvgElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${width} ${height}`,
        width: width,
        height: height,
    });

    svg.appendChild(Background({width, height}));

    const earth = Earth();
    const spaceStation = SpaceStation();
    const spaceship = Spaceship();
    const bodies = [earth, spaceStation, spaceship];

    const perspective = Perspective({
        element: {width, height},
        view: {
            position: {distance: 0, angle: 0},
            radius: spaceStation.state.position.magnitude * 1.2,
        },
    });

    svg.appendChild(perspective.node);
    bodies.forEach(body => perspective.node.appendChild(body.node));

    setInterval(() => {
        perspective.view.radius = spaceship.state.position.magnitude * 1.2;
        perspective.view.position.angle = spaceship.state.position.angle + 270;
        window.bodies = updateBodies({
            bodies,
            timeScalar: 200,
        });
        updateBodyNodesInPerspective({bodies, perspective});
        updatePerspectiveNode(perspective);
    }, 10);

    initializeKeyListeners([].concat(bodies, perspective));

    return svg;
}
