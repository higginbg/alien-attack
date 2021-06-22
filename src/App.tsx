import { useState, useEffect, useCallback, useRef } from 'react';

import { getRandomNumber } from './utils/index';
import { LogEntry } from './models/LogEntry';
import Background from './components/Background';
import Title from './components/Title';
import HealthBar from './components/HealthBar';
import Buttons from './components/Buttons';
import Log from './components/Log';

import './App.scss';

function App() {
  const [alienHealth, setAlienHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [attackLog, setAttackLog] = useState([] as LogEntry[]);
  
  const attackInterval = useRef<ReturnType<typeof setInterval>>();
  const attackTimeout = useRef<ReturnType<typeof setInterval>>();
    
  const gameOver = alienHealth === 0 || playerHealth === 0;
  const attackDisabled = !gameStarted || gameOver;
  const rechargeDisabled = !gameStarted || playerHealth === 100 || gameOver;
  
  const updateLog = useCallback((newEntry) => {
    setAttackLog(prev => {
      const updatedLog = [newEntry, ...prev];
      return updatedLog;
    });
  }, [setAttackLog]);
  
  const animateMove = useCallback((className: 'attacked' | 'attack' | 'recharge') => {
    document.querySelector('html')!.classList.add(className);
    document.querySelector('body')!.classList.add(className);
    if (attackTimeout.current) {
      clearTimeout(attackTimeout.current);
    }
    attackTimeout.current = setTimeout(() => {
      // @ts-expect-error
      document.querySelector('html')!.classList = '';
      // @ts-expect-error
      document.querySelector('body')!.classList = '';
    }, 50);
  }, [attackTimeout]);
  
  const alienAttack = useCallback(() => {
    animateMove('attacked');
 
    setPlayerHealth(prev => {
      const attackValue = getRandomNumber(5, 12);
      const updatedPlayerHealth = prev - attackValue < 0 ? 0 : prev - attackValue;
      updateLog({ type: 'alien', msg: <p>Alien deals {attackValue} damage.</p> });
      return updatedPlayerHealth;
    });
  }, [setPlayerHealth, updateLog, animateMove]);
  
  const recharge = useCallback(() => {
    if (rechargeDisabled) {
      return;
    }
 
    animateMove('recharge');
  
    setPlayerHealth(prev => {
      const healPoints = getRandomNumber(7, 14);
      const updatedPlayerHealth = prev + healPoints > 100 ? 100 : prev + healPoints;
      updateLog({ type: 'player', msg: <p style={{ color: '#D4AF37' }}>You recharge {healPoints} points.</p> });
      return updatedPlayerHealth;
    });
  }, [setPlayerHealth, animateMove, rechargeDisabled, updateLog]);

  const attack = useCallback(() => {  
    animateMove('attack');
  
    setAlienHealth(prev => {
      const attackValue = getRandomNumber(3, 10);
      const updatedAlienHealth = prev - attackValue < 0 ? 0 : prev - attackValue;
      updateLog({ type: 'player', msg: <p>You deal {attackValue} damage.</p> });
      return updatedAlienHealth;
    });
  }, [animateMove, updateLog]);
  
  const escape = useCallback(() => {
    if (!gameStarted) {
      return;
    }
 
    setGameStarted(false);
    setPlayerHealth(100);
    setAlienHealth(100);

    const newLogEntry = {
      type: '',
      msg: <p style={{ marginBottom: 10 }}>You ran away. Coward!</p>
    };
    updateLog(newLogEntry);
  }, [gameStarted, updateLog]);
  
  const start = useCallback(() => {
    setGameStarted(true);
    const newLogEntry = {
      type: '',
      msg: (
        <p style={{ marginBottom: 30 }}>
          New game started.
        </p>
      )
    };
    updateLog(newLogEntry)
  }, [setGameStarted, updateLog]);
  
  const reset = useCallback(() => {
    if (playerHealth === 100 && alienHealth === 100) {
      return;
    }

    if (!gameOver) {
      const newLogEntry = {
        type: '',
        msg: (
          <p style={{ marginBottom: 10 }}>
            You ended the game.
          </p>
        )
      };
      updateLog(newLogEntry);
    }

    setPlayerHealth(100);
    setAlienHealth(100);
 
    start();
  }, [setPlayerHealth, setAlienHealth, alienHealth, playerHealth, start, gameOver, updateLog]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = (e.key).toLowerCase();

      if (key === 'q') {
        escape();
      }
      
      if (key === 'r') {
        reset();
      }

      if (gameOver) {
        return;
      }

      if (key === 'a') {
        recharge();
        return;
      }

      if (key === 's') {
        if (!gameStarted) {
          start();
          return;
        }

        attack();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
 
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameOver, reset, attack, recharge, gameStarted, setGameStarted, escape, start]);
  
  useEffect(() => {
    if (!gameOver || !attackInterval.current) {
      return;
    }
    
    let msg = '';
    if (playerHealth === 0) {
      msg = 'You were defeated.';
    } else if (alienHealth === 0) {
      msg = 'You killed the alien!';
    }
 
    const newLogEntry = {
      type: '',
      msg: <p>{msg}</p>
    }
    updateLog(newLogEntry);
  }, [alienHealth, playerHealth, updateLog, gameOver]);
  
  useEffect(() => {
    if (gameOver || (playerHealth === 100 && alienHealth === 100)) {
      if (attackInterval.current) {
        clearInterval(attackInterval.current);
      }
      attackInterval.current = undefined;
      return;
    }
  
    if (!gameStarted) {
      return;
    }
    
    if (!!attackInterval.current) {
      return;
    }

    attackInterval.current = setInterval(() => {
      alienAttack();
    }, 200);
  }, [gameStarted, gameOver, playerHealth, alienHealth, alienAttack]);

  let message;
  let messageColor = 'white';
  if (gameStarted && playerHealth === 100 && alienHealth === 100) {
    message = <p style={{ fontSize: '1em' }}>Make the first move!</p>;
  } else if (playerHealth === 0) {
    message = <p>Game over!</p>;
    messageColor = 'red';
  } else if (alienHealth === 0) {
    message = <p>You won!</p>;
    messageColor = 'green';
  } else if (alienHealth < 30) {
    message = <p style={{ fontSize: '1em' }}>You won't defeat me!</p>;
    messageColor = 'yellow';
  } else if (playerHealth < 30) {
    message = <p style={{ fontSize: '1em' }}>I've got you now!</p>;
    messageColor = 'yellow';
  }

  return (
    <div id='wrapper'>
      <Background />
 
      <div>
        <Title gameStarted={gameStarted} />

        <div id='container' className='animate__animated animate__fadeIn animate__slow animate__delay-2s'>
          <div id='message' style={{ color: messageColor }}>
            {message}
          </div>
          
          {!gameStarted ? (
            <div id='start-container'>
              <button
                id='start'
                className='animate__animated animate__pulse animate__slow animate__infinite'
                onClick={start}
              >
                Start<span style={{ display: 'block', marginTop: 10 }}>(S)</span>
              </button>
            </div>
          ) : (
            <>
              <div id='screen'>
                <HealthBar health={alienHealth} type='alien' />
   
                <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                  <div
                    id='alien'
                    className={`icon animate__animated ${
                      alienHealth === 0 ? 'animate__rotateOut animate__slower' : 'shake'
                    }`}
                  >
                    👾
                  </div>
                  {alienHealth === 0 && (
                    <div className="icon animate__animated animate__fadeIn animate__delay-2s">
                      <div id='trophy' className="animate__animated animate__pulse animate__infinite">
                        🏆
                      </div>
                    </div>
                  )}
                </div>

                <HealthBar health={playerHealth} type='player' />
              </div>
    
              <Buttons
                attack={attack}
                recharge={recharge}
                escape={escape}
                reset={reset}
                attackDisabled={attackDisabled}
                rechargeDisabled={rechargeDisabled}
                restartDisabled={playerHealth === 100 && alienHealth === 100}
              />
            </>
          )}

        </div>
      </div>
       
      <div style={{ position: 'relative' }}>
        {gameStarted && (
          <Log logEntries={attackLog} />
        )}
      </div>
    </div>
  );
}

export default App;
