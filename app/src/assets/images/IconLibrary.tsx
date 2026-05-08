import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const IconLibrary = (props: SvgProps) => (
    <Svg
        width={props.width}
        height={props.height}
        fill="none"
        {...props}
    >
        <Path
            stroke={props.stroke}
            strokeWidth={2.5} 
            fill="none"
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M0 1a1 1 0 0 1 1-1h6a1 1 0 0 1 .832.445L9.535 3H21a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1Z"
        />
    </Svg>
)
export default IconLibrary