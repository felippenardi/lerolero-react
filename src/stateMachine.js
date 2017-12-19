import { Machine } from 'xstate';

const stateMachine = Machine({
  parallel: true,
  key: 'lerolero',
  states: {
    sheep: {
      initial: 'still',
      states: { still: {
        on: { SHAKE: 'shaking' }
      },
      shaking: {
        on: { FINISH_SHAKE: 'still' },
        initial: 'brief_shake',
        states: {
          brief_shake: {
            on: {
              SHAKE: 'crazy_shake'
            }
          },
          crazy_shake: {
            on: {
              TIMER: 'brief_shake'
            }
          }
        }
      }
      }
    },
    theme: {
      initial: 'generic',
      states: {
        generic: {
          on: { SELECT_PSYCHOANALYST: 'psychoanalyst', SELECT_DEVELOPER: 'developer' }
        },
        psychoanalyst: {
          on: { SELECT_GENERIC: 'generic', SELECT_DEVELOPER: 'developer' }
        },
        developer: {
          on: { SELECT_PSYCHOANALYST: 'psychoanalyst', SELECT_GENERIC: 'generic' }
        }
      }
    }
  }
});

export default stateMachine;
