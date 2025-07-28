import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({ maxTokens, tokensSold, navbarVersion }) => {
    return (
        <div className={navbarVersion ? "mb-0" : "my-3"}>
            {!navbarVersion && (
            <div className='text-center'>
                <p>{tokensSold} / {maxTokens} tokens sold</p>
            </div>
            )}
            <ProgressBar
            now={(tokensSold / maxTokens) * 100}
            label={`${Math.round((tokensSold / maxTokens) * 100)}%`}
            style={navbarVersion ? { height: '10px' } : {}}
            />
            {navbarVersion && (
            <div className='text-center'>
                <small>{tokensSold} / {maxTokens}</small>
            </div>
            )}
        </div>
    );
}

export default Progress;
