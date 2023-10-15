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
        this.animationTime = ANIMTATION_TIME;
        this.delay = 0;
        this.animationState = AnimationState.Idle;
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
    play(entity, entityName, type) {
        this.animationState = AnimationState.Playing;

        if (this.delay > 0) {
            return;
        }
        if (entityName === "player") {
            if (type === AnimationType.Dead) {
                entity.colour = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
            }
        }
    }

    hasEnded() {
        return this.animationState === AnimationState.End;
    }

    createParticles(x,y) {

    }

}