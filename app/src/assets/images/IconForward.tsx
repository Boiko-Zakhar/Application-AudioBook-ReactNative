import * as React from "react"
import Svg, { Defs, G, Path, SvgProps } from "react-native-svg"
const IconForward = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G fill={props.fill} fillRule="evenodd" clipRule="evenodd" filter="url(#a)">
      <Path d="M6.22 3.337A1.333 1.333 0 0 0 4 4.333v21.334a1.333 1.333 0 0 0 2.22.996l12-10.666a1.334 1.334 0 0 0 0-1.993l-12-10.667ZM21.333 3C20.597 3 20 3.597 20 4.333v21.334c0 .736.597 1.333 1.333 1.333h5.334c.736 0 1.333-.597 1.333-1.333V4.333C28 3.597 27.403 3 26.667 3h-5.334Z" />
    </G>
    <Defs></Defs>
  </Svg>
)
export default IconForward
