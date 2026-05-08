import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const IconCommunity = (props: SvgProps) => (
    <Svg
        width={props.width}
        height={props.height}
        fill="none"
        {...props}
    >
        <Path
            fill={props.fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M15 1.128a4 4 0 0 1 0 7.744M21 19v-2a4 4 0 0 0-3-3.87M12 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
    </Svg>
)

export default IconCommunity

