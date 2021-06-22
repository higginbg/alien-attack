interface Props {
  gameStarted: boolean;
}

const Title = ({ gameStarted }: Props) => (
  <h2 id='title'>
    <span
      style={{ display: 'block' }}
      className='animate__animated animate__fadeInDown'
      >
      <span className={!gameStarted ? 'animate__animated animate__flash animate__infinite animate__faster' : ''}>
        Alien
      </span>
    </span>
    <span
      style={{ display: 'block', marginTop: 15 }}
      className='animate__animated animate__fadeInDown animate__delay-1s'
      >
      <span
        style={{ fontSize: '1.1em' }}
        className={!gameStarted ? 'animate__animated animate__flash animate__infinite animate__faster' : ''}
        >
        Attack!
      </span>
    </span>
  </h2>                  
);

export default Title;
