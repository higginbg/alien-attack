import { LogEntry } from '../../models/LogEntry';

import styles from './styles.module.scss';

interface Props {
  logEntries: LogEntry[];
}

const Log = ({ logEntries = [] }: Props) => {
  if (logEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.Log}>
      <h2>Attack log</h2>

      <ul>
        {logEntries.map(({ msg, type }, i) => {
          let color = 'white';
          if (type === 'player') {
            color = 'green';
          } else if (type === 'alien') {
            color = 'red';
          }
          return (
            <li
              style={{
                fontWeight: 'bold',
                color,
              }}
              key={i}
            >
              {msg}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Log;
