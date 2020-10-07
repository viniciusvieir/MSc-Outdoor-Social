import {Dimensions, PixelRatio} from 'react native';
import { ref } from '../../server';

const {width,height} = Dimensions.get('window');
const widthToDp = number=> {
    let givenWidth = typeof number === 'number' ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel( layoutSize (width*givenWidth) / 100);
};

const heightToDP = number => {
    let givenHeight = typeof number ==='number' ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel( layoutSize(height*givenheight) / 100 );
};

const listenToOrientationChanges = ref => {
    Dimensions.addEventListener( Type: 'change' , handler: newDimention = {
        width = newDimention.screen.width;
        height = newDimention.screen.width;
        ref.setState(state: {
            orientation: height > width ? 'portrait' : 'landscape',       
        });
});
};

const removeOrientationChanges = () =>{
    Dimensions.removeEventListener( type: 'change');
};
    const getDynamicsStyles = (portraitStyle,landscapeStyle) =>{
    const isPortrait= height > width;
    if (isPortrait)
    {
        return portraitStyle;
    }
};

export {widthToDp,heightToDP,listenToOrientationChanges,
    removeOrientationChanges,
    getDynamicsStyles
}
