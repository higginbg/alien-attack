import styles from './styles.module.scss';

interface Props {
  health: number;
  type: 'player' | 'alien';
}

const HealthBar = ({ health, type }: Props) => {
  const healthCritical = health < 20;

  const barStyles = {
    height: `${(health / 100) * 100}%`,
    backgroundColor: healthCritical ? 'red' : 'white',
  };

  return (
    <div
      className={styles.HealthBar}
      style={{ border: `1px solid ${healthCritical ? 'red' : 'white'}`}}
    >
      <div className={styles.Label}>{type === 'player' ? 'you' : type}</div>
      <div
        className={styles.Bar}
        style={barStyles}
      ></div>
    </div>
  );
};

export default HealthBar;
