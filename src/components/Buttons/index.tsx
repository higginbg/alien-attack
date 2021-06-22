import styles from './styles.module.scss';

interface Props {
  recharge: () => void;
  attack: () => void;
  escape: () => void;
  reset: () => void;
  rechargeDisabled: boolean;
  attackDisabled: boolean;
  restartDisabled: boolean;
}

const Buttons = ({
  recharge,
  attack,
  escape,
  reset,
  rechargeDisabled,
  attackDisabled,
  restartDisabled,
}: Props) => (
  <div className={styles.Buttons}>
    <div>
      <button
        className={styles.Recharge}
        onClick={recharge}
        disabled={rechargeDisabled}
      >
        Recharge (A)
      </button>

      <button
        className={styles.Attack}
        onClick={attack}
        disabled={attackDisabled}
      >
        Attack (S)
      </button>
    </div>

    <div style={{ marginTop: 10 }}>
      <button className={styles.Exit} onClick={escape}>
        Exit (Q)
      </button>
      <button
        className={styles.Restart}
        onClick={reset}
        disabled={restartDisabled}
      >
        Restart (R)
      </button>
    </div>
  </div>
);

export default Buttons;
