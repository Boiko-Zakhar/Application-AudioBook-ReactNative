import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconClockActive = (props: SvgProps) => (
    <Svg fill="none" {...props}>
        <Path
            fill={props.fill}
            fillRule="evenodd"
            d="M9 3a1 1 0 0 0-1 1v3.586H6V4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3.586h-2V4a1 1 0 0 0-1-1H9ZM12 12.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm-2.5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"
            clipRule="evenodd"
        />
        <Path
            fill={props.fill}
            fillRule="evenodd"
            d="M11 17.979V14.5h2v3.479h-2Z"
            clipRule="evenodd"
        />
        <Path
            fill={props.fill}
            fillRule="evenodd"
            d="M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-9 7a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z"
            clipRule="evenodd"
        />
    </Svg>
)
export default IconClockActive
