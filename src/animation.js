import { Particle } from './renderers'
import { add, remove, find } from './utils';

const ANIMTATION_TIME = 1000;

// The delay between switching animation frames so that we don't 
// spazz out
const DELAY = 100;

// all the jpegs for the animations here
const AnimationState = {
    Idle: 0,
    Playing: 1,
    End: 2,
}


export const AnimationType = {
    Dead: 0,
}

export class AnimationHandler {
    constructor() {
        this.particleGenerator = new ParticleGenerator();
        this.animationTime = ANIMTATION_TIME;
        this.delay = 0;
        this.animationState = AnimationState.Idle;
    }
    
    isFinishingAnimation() {
        return this.particleGenerator.getNumberOfParticles().length <= 0;
    }

    handleAnimationTime() {
        switch (this.animationState) {
            case AnimationState.Idle:
                break;
            case AnimationState.Playing:
                this.animationTime -= 1;
                this.delay += 1;

                if (this.delay > DELAY) {
                    this.delay = 0;
                }
                if (this.animationTime <= 0) {  
                    this.animationState = AnimationState.End;
                }
                break;
            case AnimationState.End:
                this.animationTime = ANIMTATION_TIME;
                // this.animationState = AnimationState.Idle;
                break;
            default:
                break;
        }
    }
    play(entities, entityName, type) {
        if (!this.isFinishingAnimation()) {
            this.animationState = AnimationState.Playing;
        }

        if (this.delay > 0) {
            return entities;
        }
        if (entityName === "player") {
            if (type === AnimationType.Dead) {
                const player = entities[entityName];

                // check if we want to add more particles
                if (this.particleGenerator.getNumberOfParticles() < 1) {
                    entities = this.particleGenerator.createParticles(player.x, player.y, entities)
                } 
                
                
                this.particleGenerator.updateParticles(entities);
                player.colour = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
            }
        }

        return entities;
    }

    hasEnded() {
        return this.animationState === AnimationState.End && this.isFinishingAnimation();
    }

}

const HandleAnimations = (entities, { input }) => {
}

class ParticleGenerator {
    constructor() {
        this.particles = [];
        this.particleTime = 5;
    }

    getNumberOfParticles() {
        return this.particles.length;
    }

    createParticles(x,y, entities) {
        const particleEntityName = `particle${this.particles.length}`
        const particle = { x,  y, renderer: <Particle />, sprite: null, timeAlive: 0};
        this.particles.push(particleEntityName);
        const newEntities = add(entities, particle, particleEntityName); 
        // if (entities[particleEntityName] == null) {
        //     entities[particleEntityName] = particle;
        // }
        return newEntities;

    }

    updateParticles(entities) {
        // no more particles to update
        if (this.particles.length <= 0) {
            return entities;
        }

        // we want to find all the particles then update each of them

        const particles = this.particles.map(particle => find(entities, particle));

        for (let i = 0; i < particles.length; i++) {
            let entity = particles[i];
            entity.timeAlive += 1;
            if (entity.timeAlive > this.particleTime) {
                entities = remove(entities, this.particles[i]);
                this.particles.splice(i, 1);
            }

        }

        // particles.forEach((entity, i) => {
        //     if (entity.timeAlive > this.particleTime) {
        //         console.log(entity)
        //         entities = remove(entities, this.particles[i]);
        //         return entities;
        //     }

        //     console.log('still goes here')

        //     entity.y -= Math.random() * 10;
        //     entity.timeAlive += 1;

        // })

        return entities;

    }

    removeParticle(entities) {

    }
}