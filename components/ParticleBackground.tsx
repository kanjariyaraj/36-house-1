import React from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
    const particlesInit = async (main: any) => {
        await loadFull(main);
    };

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    fullScreen: {
                        enable: false,
                        zIndex: -1
                    },
                    fpsLimit: 60,
                    particles: {
                        color: {
                            value: ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
                        },
                        links: {
                            color: "#94A3B8",
                            distance: 150,
                            enable: true,
                            opacity: 0.3,
                            width: 1,
                        },
                        collisions: {
                            enable: true,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: true,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 30,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }}
                className="w-full h-full"
            />
        </div>
    );
};

export default ParticleBackground;