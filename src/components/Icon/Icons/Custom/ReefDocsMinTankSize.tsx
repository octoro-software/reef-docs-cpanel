import React from "react";
import { G, Path, Svg } from "react-native-svg";
import { BLACK } from "../../../../constants";

export const ReefDocsMinTankSize = ({
  width = 48,
  height = 48,
  fill = "#1b1b1a",
  strokeFill = BLACK,
  strokeWidth = 2,
}) => {
  return (
    <Svg height={height} viewBox="0 0 400 400" width={width} fill={fill}>
      <G>
        <G>
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M119.83,282.48c-21.47,0-38.03-18.1-38.76-18.91-.9-.93-1.82-1.68-2.81-2.47-1.37-1.1-2.79-2.25-4.16-4-1.02-1.3-.79-3.19.51-4.21,1.3-1.02,3.19-.79,4.21.51.95,1.21,1.99,2.05,3.2,3.02,1.04.83,2.21,1.78,3.44,3.06.23.25,17.19,18.7,37.26,16.87,1.65-.15,2.31-.77,2.67-1.22,2.22-2.82,1.05-10.85,0-17.93l-.13-.9c-.24-1.64.9-3.16,2.54-3.4,1.64-.23,3.16.9,3.4,2.54l.13.9c1.33,9.08,2.59,17.66-1.23,22.51-1.61,2.04-3.91,3.21-6.83,3.48-1.16.11-2.3.16-3.43.16Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M58.62,209.29c-1.59,0-2.91-1.25-2.99-2.85-.88-17.67,3.24-34.92,6.93-47.97,9.94-35.12,46.33-62.74,74.08-66.52,28.59-3.88,48.85,9.87,49.7,10.46,1.36.94,1.7,2.81.76,4.17-.94,1.36-2.81,1.7-4.17.76h0c-.19-.13-19.29-13-45.48-9.45-25.88,3.52-59.83,29.35-69.12,62.2-3.57,12.61-7.55,29.23-6.71,46.03.08,1.65-1.19,3.06-2.85,3.15-.05,0-.1,0-.15,0Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M188.26,209.29c-.81,0-1.61-.32-2.2-.96-1.13-1.22-1.05-3.11.16-4.24,24.5-22.7,32.65-53.4,30.93-57.85-1.46-3.36-2.4-3.51-6.9-4.2-3.79-.58-9.52-1.46-17.72-5.36-18.96-9.01-17.8-28.99-17.75-29.84.12-1.65,1.54-2.9,3.2-2.79,1.65.11,2.9,1.54,2.79,3.19-.04.73-.85,16.79,14.33,24.01,7.41,3.52,12.41,4.29,16.06,4.85,4.87.75,8.71,1.34,11.5,7.75,3.09,7.13-6.45,40.63-32.36,64.63-.58.53-1.31.8-2.04.8Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M97.21,315.28c-2.15,0-3.92-.48-4.67-1.84-.65-1.18-.61-3.01,1.03-4.22,2.45-1.81,3.18-7.62-.99-16.09-5.88-11.97,2.86-21.67,3.24-22.08,1.12-1.22,3.02-1.3,4.24-.17,1.21,1.12,1.29,3.01.18,4.23-.27.3-6.32,7.15-2.27,15.37,3.93,7.99,4.28,14.11,2.85,18.33,4.99-.98,12.83-3.56,18.17-9.26,5-5.34,6.51-12.28,4.49-20.61-.39-1.61.6-3.23,2.21-3.62,1.61-.39,3.23.6,3.62,2.21,3.85,15.86-3.23,28.57-19.44,34.89-.1.04-7.46,2.87-12.66,2.87Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M141,284.62c-3.95,0-8.28-.83-12.99-2.8-1.53-.64-2.25-2.4-1.6-3.93.64-1.53,2.4-2.24,3.93-1.6,7.94,3.34,15.39,3.06,22.11-.84,6.86-3.97,11.47-10.74,13.86-15.38-3.29.2-7.18-.69-11.33-2.66-1.5-.71-2.13-2.5-1.42-4,.71-1.5,2.5-2.14,4-1.42,5.7,2.7,9.79,2.47,11.17,1.12,1.46-1.42,3.25-1.19,4.29-.37.95.74,3.17,2.48-2.65,12.41-3.07,5.23-12.95,19.47-29.37,19.47Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M58.86,195.87c-.59,0-1.19-.17-1.71-.54-17.52-12.18-14.02-24.77-11.2-34.88,1.23-4.41,2.39-8.57,1.69-12.16-.69-3.53-3.87-4.8-8.65-6.33-3.72-1.2-7.58-2.43-8.57-6.17-.9-3.37,1.03-7.34,6.45-13.27,18.19-19.92,60.46-13.12,62.25-12.82,1.63.27,2.74,1.82,2.46,3.45s-1.82,2.74-3.45,2.47c-.41-.07-40.84-6.57-56.83,10.94-5.47,5.99-5.08,7.67-5.08,7.68.32.63,3.11,1.52,4.61,2,4.76,1.53,11.28,3.62,12.7,10.89.97,4.98-.43,10.04-1.8,14.92-2.78,9.98-5.18,18.6,8.84,28.35,1.36.95,1.7,2.81.75,4.18-.58.84-1.52,1.29-2.47,1.29Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M101.71,113.32c-.07,0-.14,0-.22,0-1.65-.12-2.89-1.55-2.78-3.2.03-.37,3.03-37.48,40.11-40.75,1.64-.15,2.71.47,3.32,1.01,1.58,1.39,1.68,3.47,1.78,5.68.21,4.5.49,10.67,10.22,15.82,1.46.77,2.03,2.59,1.25,4.05-.77,1.46-2.59,2.02-4.05,1.25-12.76-6.74-13.18-15.92-13.41-20.85-.01-.26-.03-.55-.04-.84-30.54,3.62-33.1,33.75-33.19,35.05-.12,1.58-1.43,2.78-2.99,2.78Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M160.58,191.19c-.3,0-.61-.05-.91-.14-30.13-9.62-28.76-41.56-28.75-41.88.06-1.08.7-2.05,1.67-2.53.97-.48,2.13-.39,3.03.22,23.49,16.21,42.67,17.03,54.63,14.87,1.62-.3,3.19.79,3.49,2.42.29,1.63-.79,3.19-2.42,3.49-5.01.91-11.18,1.35-18.29.56-3.13.09-5.44,1.1-7.05,3.08-3.68,4.53-3.02,13.35-2.45,16.36.19,1.04-.17,2.1-.96,2.8-.56.49-1.27.75-1.99.75ZM137.2,155.06c.96,7.79,4.82,21.72,19.92,28.59-.17-4.63.37-11.43,4.2-16.15.37-.46.76-.89,1.17-1.29-7.69-2.02-16.18-5.51-25.29-11.16Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M154.33,148.98c-.51,0-1.02-.02-1.54-.05-5.81-.4-11.11-3.04-14.94-7.43-3.82-4.39-5.71-10.01-5.3-15.82.83-11.99,11.26-21.08,23.25-20.24,5.81.4,11.11,3.04,14.94,7.43s5.71,10.01,5.3,15.82h0c-.4,5.81-3.04,11.11-7.43,14.94-4,3.48-9.02,5.36-14.28,5.36ZM154.29,111.38c-8.22,0-15.17,6.39-15.75,14.71-.29,4.21,1.07,8.28,3.84,11.46,2.77,3.18,6.61,5.1,10.82,5.39,4.21.29,8.28-1.07,11.46-3.84,3.18-2.77,5.1-6.61,5.39-10.82h0c.29-4.21-1.07-8.28-3.84-11.46-2.77-3.18-6.62-5.1-10.82-5.39-.37-.03-.74-.04-1.1-.04Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M204.29,139.99c-.72,0-1.44-.26-2.01-.77-1.23-1.11-1.33-3.01-.21-4.24,2.39-2.64,3.78-5.93,4.03-9.49.29-4.21-1.07-8.28-3.84-11.46s-6.61-5.1-10.82-5.39c-4.1-.28-8.09,1.01-11.24,3.65-1.27,1.06-3.16.9-4.23-.37-1.06-1.27-.9-3.16.37-4.23,4.35-3.64,9.86-5.43,15.51-5.04,5.81.4,11.11,3.04,14.94,7.43,3.82,4.39,5.71,10.01,5.3,15.82-.34,4.92-2.27,9.45-5.57,13.1-.59.66-1.41.99-2.23.99Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M170.07,199.91c-10.46,0-21.51-3.89-33.01-11.63-17.93-12.07-27-31.16-26.24-55.19.57-18.06,6.55-32.76,6.61-32.91.21-.51.79-.75,1.31-.54.51.21.75.79.54,1.31-.06.14-5.91,14.55-6.46,32.27-.73,23.62,7.8,41.58,25.36,53.41,15.39,10.36,29.89,13.61,43.11,9.64,23.25-6.97,34.84-34.2,34.96-34.47.21-.51.8-.75,1.31-.54.51.21.75.8.54,1.31-.48,1.15-12.06,28.36-36.22,35.62-3.84,1.15-7.78,1.73-11.8,1.73Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M158.3,129.01c-4.41-.31-8.23,3.02-8.54,7.43-.31,4.41,3.02,8.23,7.43,8.54,4.41.31,8.23-3.02,8.54-7.43.31-4.41-3.02-8.23-7.43-8.54ZM159.68,138.19c-1.88,0-3.41-1.53-3.41-3.41s1.53-3.41,3.41-3.41,3.41,1.53,3.41,3.41-1.53,3.41-3.41,3.41Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M199.35,121c-4.41-.31-8.23,3.02-8.54,7.43-.31,4.41,3.02,8.23,7.43,8.54,4.41.31,8.23-3.02,8.54-7.43.31-4.41-3.02-8.23-7.43-8.54ZM200.72,130.19c-1.88,0-3.41-1.53-3.41-3.41s1.53-3.41,3.41-3.41,3.41,1.53,3.41,3.41-1.53,3.41-3.41,3.41Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M91.85,233.62c-4.85,0-12.68-5.46-18.39-12.86-5.22-6.77-13.08-20.99-7.08-40.15.41-1.32,1.82-2.05,3.13-1.64,1.32.41,2.05,1.82,1.64,3.13-5.33,16.99,1.64,29.6,6.27,35.6,5.75,7.45,12.43,11,14.49,10.92,1.92-.09,2.72-1.02,4.22-2.96,1.9-2.46,4.52-5.81,10.98-5.69,6.1.1,14.74-3.56,15.43-6.58.34-1.48-2.05-3.58-6.22-5.49-32.64-14.9-42.09-36.12-42.48-37.02-.55-1.27.04-2.74,1.31-3.29,1.26-.54,2.73.04,3.28,1.3h0c.02.05,2.28,5.14,8.31,11.9,5.56,6.24,15.57,15.21,31.66,22.56,6.95,3.17,9.98,6.92,9.02,11.15-1.48,6.51-13.24,10.59-20.41,10.46-3.94-.08-5.2,1.53-6.93,3.75-1.62,2.09-3.63,4.69-7.94,4.89-.09,0-.19,0-.29,0Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M33.21,132.37c-.36,0-.7-.19-.88-.52-.26-.49-.08-1.09.4-1.35.29-.16,29.13-15.5,54.36-8.08.53.16.83.71.68,1.24-.16.53-.71.83-1.24.68-24.43-7.18-52.56,7.77-52.84,7.92-.15.08-.31.12-.47.12Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M75.97,137.9c-.16,0-.32-.04-.47-.12-15.93-8.41-40.22-.03-40.46.06-.52.18-1.09-.09-1.28-.61s.09-1.09.61-1.28c.26-.09,6.38-2.23,14.64-3.32,7.67-1.01,18.66-1.25,27.42,3.38.49.26.68.86.42,1.35-.18.34-.53.53-.89.53Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M66.72,156.27c-.39,0-.76-.23-.92-.61-4.49-10.7-19.81-13.1-19.97-13.13-.55-.08-.92-.59-.84-1.14.08-.55.59-.92,1.14-.84.67.1,16.59,2.6,21.52,14.33.21.51-.03,1.1-.54,1.31-.13.05-.26.08-.39.08Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M114.38,103.5s-.04,0-.07,0c-.55-.04-.97-.51-.93-1.06.49-7.25,5.03-14.91,13.12-22.16,6.05-5.41,11.86-8.66,12.1-8.79.48-.27,1.09-.09,1.36.39.27.48.09,1.09-.39,1.36-.23.13-23.09,13-24.19,29.34-.04.53-.48.93-1,.93Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M133.48,96.54c-.45,0-.86-.31-.97-.76-2.61-10.75,5.53-18.94,5.88-19.28.39-.39,1.03-.38,1.41,0,.39.39.38,1.03,0,1.41-.08.08-7.67,7.75-5.34,17.39.13.54-.2,1.08-.74,1.21-.08.02-.16.03-.24.03Z"
          />
        </G>
        <G>
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M385.06,50.74H14.94c-1.66,0-3-1.34-3-3v-19.77c0-1.66,1.34-3,3-3h370.12c1.66,0,3,1.34,3,3v19.77c0,1.66-1.34,3-3,3ZM17.94,44.74h364.12v-13.77H17.94v13.77Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M376.26,344.3H23.74c-1.66,0-3-1.34-3-3V47.74c0-1.66,1.34-3,3-3s3,1.34,3,3v290.56h346.52V47.74c0-1.66,1.34-3,3-3s3,1.34,3,3v293.56c0,1.66-1.34,3-3,3Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M376.27,375.02h-48.24c-.49,0-.98-.12-1.42-.36l-22.42-12.01H95.8l-22.42,12.01c-.44.23-.92.36-1.42.36H23.73c-1.66,0-3-1.34-3-3v-30.72c0-1.66,1.34-3,3-3s3,1.34,3,3v27.72h44.49l22.42-12.01c.44-.23.92-.36,1.42-.36h209.9c.49,0,.98.12,1.42.36l22.42,12.01h44.49v-27.72c0-1.66,1.34-3,3-3s3,1.34,3,3v30.72c0,1.66-1.34,3-3,3Z"
          />
        </G>
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M365.75,256.2H37.29c-1.38,0-2.5-1.12-2.5-2.5v-46.04c0-1.38,1.12-2.5,2.5-2.5h31.77c1.38,0,2.5,1.12,2.5,2.5s-1.12,2.5-2.5,2.5h-29.27v41.04h323.46v-41.04H121.57c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5h244.18c1.38,0,2.5,1.12,2.5,2.5v46.04c0,1.38-1.12,2.5-2.5,2.5Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M157.75,186.5s-.07,0-.1,0c-.55-.05-.95-.54-.9-1.09.86-8.78-2.46-15.62-9.86-20.33-5.59-3.56-11.49-4.5-11.55-4.5-.55-.08-.92-.59-.84-1.14s.59-.92,1.14-.84c.25.04,25.33,4.17,23.1,27-.05.52-.49.9-.99.9Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M353.09,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M341.62,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M330.16,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M318.69,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M307.22,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M295.75,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M284.28,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M272.81,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M261.34,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M249.87,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M238.4,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M226.93,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M215.46,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M203.99,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M192.52,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M181.05,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M169.59,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M158.12,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M146.65,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M135.18,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M123.71,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M112.24,233.93c-.55,0-1-.45-1-1v-12.09c0-.55.45-1,1-1s1,.45,1,1v12.09c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M66.36,233.93c-.55,0-1-.45-1-1v-19.22c0-.55.45-1,1-1s1,.45,1,1v19.22c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M54.89,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M43.42,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M236.23,209.29c-.86,0-1.71-.37-2.3-1.07-1.06-1.27-.9-3.16.37-4.23,3.65-3.06,7.43-14.14,7.22-21.16-.07-2.42-.62-3.36-.81-3.49-.16-.04-1.08.07-2.82,1.23-14.48,9.65-32.99,10.59-33.77,10.62-1.67.08-3.06-1.21-3.13-2.86s1.21-3.06,2.86-3.13c.2,0,17.66-.92,30.71-9.62,6.52-4.35,9.88-1.27,11.03.25,4.91,6.56-.67,27.1-7.44,32.77-.56.47-1.25.7-1.92.7Z"
        />
      </G>
      <G>
        <G>
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M119.83,282.48c-21.47,0-38.03-18.1-38.76-18.91-.9-.93-1.82-1.68-2.81-2.47-1.37-1.1-2.79-2.25-4.16-4-1.02-1.3-.79-3.19.51-4.21,1.3-1.02,3.19-.79,4.21.51.95,1.21,1.99,2.05,3.2,3.02,1.04.83,2.21,1.78,3.44,3.06.23.25,17.19,18.7,37.26,16.87,1.65-.15,2.31-.77,2.67-1.22,2.22-2.82,1.05-10.85,0-17.93l-.13-.9c-.24-1.64.9-3.16,2.54-3.4,1.64-.23,3.16.9,3.4,2.54l.13.9c1.33,9.08,2.59,17.66-1.23,22.51-1.61,2.04-3.91,3.21-6.83,3.48-1.16.11-2.3.16-3.43.16Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M58.62,209.29c-1.59,0-2.91-1.25-2.99-2.85-.88-17.67,3.24-34.92,6.93-47.97,9.94-35.12,46.33-62.74,74.08-66.52,28.59-3.88,48.85,9.87,49.7,10.46,1.36.94,1.7,2.81.76,4.17-.94,1.36-2.81,1.7-4.17.76h0c-.19-.13-19.29-13-45.48-9.45-25.88,3.52-59.83,29.35-69.12,62.2-3.57,12.61-7.55,29.23-6.71,46.03.08,1.65-1.19,3.06-2.85,3.15-.05,0-.1,0-.15,0Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M188.26,209.29c-.81,0-1.61-.32-2.2-.96-1.13-1.22-1.05-3.11.16-4.24,24.5-22.7,32.65-53.4,30.93-57.85-1.46-3.36-2.4-3.51-6.9-4.2-3.79-.58-9.52-1.46-17.72-5.36-18.96-9.01-17.8-28.99-17.75-29.84.12-1.65,1.54-2.9,3.2-2.79,1.65.11,2.9,1.54,2.79,3.19-.04.73-.85,16.79,14.33,24.01,7.41,3.52,12.41,4.29,16.06,4.85,4.87.75,8.71,1.34,11.5,7.75,3.09,7.13-6.45,40.63-32.36,64.63-.58.53-1.31.8-2.04.8Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M97.21,315.28c-2.15,0-3.92-.48-4.67-1.84-.65-1.18-.61-3.01,1.03-4.22,2.45-1.81,3.18-7.62-.99-16.09-5.88-11.97,2.86-21.67,3.24-22.08,1.12-1.22,3.02-1.3,4.24-.17,1.21,1.12,1.29,3.01.18,4.23-.27.3-6.32,7.15-2.27,15.37,3.93,7.99,4.28,14.11,2.85,18.33,4.99-.98,12.83-3.56,18.17-9.26,5-5.34,6.51-12.28,4.49-20.61-.39-1.61.6-3.23,2.21-3.62,1.61-.39,3.23.6,3.62,2.21,3.85,15.86-3.23,28.57-19.44,34.89-.1.04-7.46,2.87-12.66,2.87Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M141,284.62c-3.95,0-8.28-.83-12.99-2.8-1.53-.64-2.25-2.4-1.6-3.93.64-1.53,2.4-2.24,3.93-1.6,7.94,3.34,15.39,3.06,22.11-.84,6.86-3.97,11.47-10.74,13.86-15.38-3.29.2-7.18-.69-11.33-2.66-1.5-.71-2.13-2.5-1.42-4,.71-1.5,2.5-2.14,4-1.42,5.7,2.7,9.79,2.47,11.17,1.12,1.46-1.42,3.25-1.19,4.29-.37.95.74,3.17,2.48-2.65,12.41-3.07,5.23-12.95,19.47-29.37,19.47Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M58.86,195.87c-.59,0-1.19-.17-1.71-.54-17.52-12.18-14.02-24.77-11.2-34.88,1.23-4.41,2.39-8.57,1.69-12.16-.69-3.53-3.87-4.8-8.65-6.33-3.72-1.2-7.58-2.43-8.57-6.17-.9-3.37,1.03-7.34,6.45-13.27,18.19-19.92,60.46-13.12,62.25-12.82,1.63.27,2.74,1.82,2.46,3.45s-1.82,2.74-3.45,2.47c-.41-.07-40.84-6.57-56.83,10.94-5.47,5.99-5.08,7.67-5.08,7.68.32.63,3.11,1.52,4.61,2,4.76,1.53,11.28,3.62,12.7,10.89.97,4.98-.43,10.04-1.8,14.92-2.78,9.98-5.18,18.6,8.84,28.35,1.36.95,1.7,2.81.75,4.18-.58.84-1.52,1.29-2.47,1.29Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M101.71,113.32c-.07,0-.14,0-.22,0-1.65-.12-2.89-1.55-2.78-3.2.03-.37,3.03-37.48,40.11-40.75,1.64-.15,2.71.47,3.32,1.01,1.58,1.39,1.68,3.47,1.78,5.68.21,4.5.49,10.67,10.22,15.82,1.46.77,2.03,2.59,1.25,4.05-.77,1.46-2.59,2.02-4.05,1.25-12.76-6.74-13.18-15.92-13.41-20.85-.01-.26-.03-.55-.04-.84-30.54,3.62-33.1,33.75-33.19,35.05-.12,1.58-1.43,2.78-2.99,2.78Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M160.58,191.19c-.3,0-.61-.05-.91-.14-30.13-9.62-28.76-41.56-28.75-41.88.06-1.08.7-2.05,1.67-2.53.97-.48,2.13-.39,3.03.22,23.49,16.21,42.67,17.03,54.63,14.87,1.62-.3,3.19.79,3.49,2.42.29,1.63-.79,3.19-2.42,3.49-5.01.91-11.18,1.35-18.29.56-3.13.09-5.44,1.1-7.05,3.08-3.68,4.53-3.02,13.35-2.45,16.36.19,1.04-.17,2.1-.96,2.8-.56.49-1.27.75-1.99.75ZM137.2,155.06c.96,7.79,4.82,21.72,19.92,28.59-.17-4.63.37-11.43,4.2-16.15.37-.46.76-.89,1.17-1.29-7.69-2.02-16.18-5.51-25.29-11.16Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M154.33,148.98c-.51,0-1.02-.02-1.54-.05-5.81-.4-11.11-3.04-14.94-7.43-3.82-4.39-5.71-10.01-5.3-15.82.83-11.99,11.26-21.08,23.25-20.24,5.81.4,11.11,3.04,14.94,7.43s5.71,10.01,5.3,15.82h0c-.4,5.81-3.04,11.11-7.43,14.94-4,3.48-9.02,5.36-14.28,5.36ZM154.29,111.38c-8.22,0-15.17,6.39-15.75,14.71-.29,4.21,1.07,8.28,3.84,11.46,2.77,3.18,6.61,5.1,10.82,5.39,4.21.29,8.28-1.07,11.46-3.84,3.18-2.77,5.1-6.61,5.39-10.82h0c.29-4.21-1.07-8.28-3.84-11.46-2.77-3.18-6.62-5.1-10.82-5.39-.37-.03-.74-.04-1.1-.04Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M204.29,139.99c-.72,0-1.44-.26-2.01-.77-1.23-1.11-1.33-3.01-.21-4.24,2.39-2.64,3.78-5.93,4.03-9.49.29-4.21-1.07-8.28-3.84-11.46s-6.61-5.1-10.82-5.39c-4.1-.28-8.09,1.01-11.24,3.65-1.27,1.06-3.16.9-4.23-.37-1.06-1.27-.9-3.16.37-4.23,4.35-3.64,9.86-5.43,15.51-5.04,5.81.4,11.11,3.04,14.94,7.43,3.82,4.39,5.71,10.01,5.3,15.82-.34,4.92-2.27,9.45-5.57,13.1-.59.66-1.41.99-2.23.99Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M170.07,199.91c-10.46,0-21.51-3.89-33.01-11.63-17.93-12.07-27-31.16-26.24-55.19.57-18.06,6.55-32.76,6.61-32.91.21-.51.79-.75,1.31-.54.51.21.75.79.54,1.31-.06.14-5.91,14.55-6.46,32.27-.73,23.62,7.8,41.58,25.36,53.41,15.39,10.36,29.89,13.61,43.11,9.64,23.25-6.97,34.84-34.2,34.96-34.47.21-.51.8-.75,1.31-.54.51.21.75.8.54,1.31-.48,1.15-12.06,28.36-36.22,35.62-3.84,1.15-7.78,1.73-11.8,1.73Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M158.3,129.01c-4.41-.31-8.23,3.02-8.54,7.43-.31,4.41,3.02,8.23,7.43,8.54,4.41.31,8.23-3.02,8.54-7.43.31-4.41-3.02-8.23-7.43-8.54ZM159.68,138.19c-1.88,0-3.41-1.53-3.41-3.41s1.53-3.41,3.41-3.41,3.41,1.53,3.41,3.41-1.53,3.41-3.41,3.41Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M199.35,121c-4.41-.31-8.23,3.02-8.54,7.43-.31,4.41,3.02,8.23,7.43,8.54,4.41.31,8.23-3.02,8.54-7.43.31-4.41-3.02-8.23-7.43-8.54ZM200.72,130.19c-1.88,0-3.41-1.53-3.41-3.41s1.53-3.41,3.41-3.41,3.41,1.53,3.41,3.41-1.53,3.41-3.41,3.41Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M91.85,233.62c-4.85,0-12.68-5.46-18.39-12.86-5.22-6.77-13.08-20.99-7.08-40.15.41-1.32,1.82-2.05,3.13-1.64,1.32.41,2.05,1.82,1.64,3.13-5.33,16.99,1.64,29.6,6.27,35.6,5.75,7.45,12.43,11,14.49,10.92,1.92-.09,2.72-1.02,4.22-2.96,1.9-2.46,4.52-5.81,10.98-5.69,6.1.1,14.74-3.56,15.43-6.58.34-1.48-2.05-3.58-6.22-5.49-32.64-14.9-42.09-36.12-42.48-37.02-.55-1.27.04-2.74,1.31-3.29,1.26-.54,2.73.04,3.28,1.3h0c.02.05,2.28,5.14,8.31,11.9,5.56,6.24,15.57,15.21,31.66,22.56,6.95,3.17,9.98,6.92,9.02,11.15-1.48,6.51-13.24,10.59-20.41,10.46-3.94-.08-5.2,1.53-6.93,3.75-1.62,2.09-3.63,4.69-7.94,4.89-.09,0-.19,0-.29,0Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M33.21,132.37c-.36,0-.7-.19-.88-.52-.26-.49-.08-1.09.4-1.35.29-.16,29.13-15.5,54.36-8.08.53.16.83.71.68,1.24-.16.53-.71.83-1.24.68-24.43-7.18-52.56,7.77-52.84,7.92-.15.08-.31.12-.47.12Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M75.97,137.9c-.16,0-.32-.04-.47-.12-15.93-8.41-40.22-.03-40.46.06-.52.18-1.09-.09-1.28-.61s.09-1.09.61-1.28c.26-.09,6.38-2.23,14.64-3.32,7.67-1.01,18.66-1.25,27.42,3.38.49.26.68.86.42,1.35-.18.34-.53.53-.89.53Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M66.72,156.27c-.39,0-.76-.23-.92-.61-4.49-10.7-19.81-13.1-19.97-13.13-.55-.08-.92-.59-.84-1.14.08-.55.59-.92,1.14-.84.67.1,16.59,2.6,21.52,14.33.21.51-.03,1.1-.54,1.31-.13.05-.26.08-.39.08Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M114.38,103.5s-.04,0-.07,0c-.55-.04-.97-.51-.93-1.06.49-7.25,5.03-14.91,13.12-22.16,6.05-5.41,11.86-8.66,12.1-8.79.48-.27,1.09-.09,1.36.39.27.48.09,1.09-.39,1.36-.23.13-23.09,13-24.19,29.34-.04.53-.48.93-1,.93Z"
          />
          <Path
            fill={fill}
            stroke={strokeFill}
            strokeWidth={strokeWidth} // Ensure this is set properly
            strokeLinecap="round"
            d="M133.48,96.54c-.45,0-.86-.31-.97-.76-2.61-10.75,5.53-18.94,5.88-19.28.39-.39,1.03-.38,1.41,0,.39.39.38,1.03,0,1.41-.08.08-7.67,7.75-5.34,17.39.13.54-.2,1.08-.74,1.21-.08.02-.16.03-.24.03Z"
          />
        </G>
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M365.75,256.2H37.29c-1.38,0-2.5-1.12-2.5-2.5v-46.04c0-1.38,1.12-2.5,2.5-2.5h31.77c1.38,0,2.5,1.12,2.5,2.5s-1.12,2.5-2.5,2.5h-29.27v41.04h323.46v-41.04H121.57c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5h244.18c1.38,0,2.5,1.12,2.5,2.5v46.04c0,1.38-1.12,2.5-2.5,2.5Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M157.75,186.5s-.07,0-.1,0c-.55-.05-.95-.54-.9-1.09.86-8.78-2.46-15.62-9.86-20.33-5.59-3.56-11.49-4.5-11.55-4.5-.55-.08-.92-.59-.84-1.14s.59-.92,1.14-.84c.25.04,25.33,4.17,23.1,27-.05.52-.49.9-.99.9Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M353.09,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M341.62,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M330.16,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M318.69,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M307.22,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M295.75,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M284.28,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M272.81,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M261.34,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M249.87,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M238.4,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M226.93,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M215.46,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M203.99,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M192.52,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M181.05,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M169.59,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M158.12,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M146.65,237.34c-.55,0-1-.45-1-1v-22.63c0-.55.45-1,1-1s1,.45,1,1v22.63c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M135.18,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M123.71,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M112.24,233.93c-.55,0-1-.45-1-1v-12.09c0-.55.45-1,1-1s1,.45,1,1v12.09c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M66.36,233.93c-.55,0-1-.45-1-1v-19.22c0-.55.45-1,1-1s1,.45,1,1v19.22c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M54.89,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M43.42,226.49c-.55,0-1-.45-1-1v-11.78c0-.55.45-1,1-1s1,.45,1,1v11.78c0,.55-.45,1-1,1Z"
        />
        <Path
          fill={fill}
          stroke={strokeFill}
          strokeWidth={strokeWidth} // Ensure this is set properly
          strokeLinecap="round"
          d="M236.23,209.29c-.86,0-1.71-.37-2.3-1.07-1.06-1.27-.9-3.16.37-4.23,3.65-3.06,7.43-14.14,7.22-21.16-.07-2.42-.62-3.36-.81-3.49-.16-.04-1.08.07-2.82,1.23-14.48,9.65-32.99,10.59-33.77,10.62-1.67.08-3.06-1.21-3.13-2.86s1.21-3.06,2.86-3.13c.2,0,17.66-.92,30.71-9.62,6.52-4.35,9.88-1.27,11.03.25,4.91,6.56-.67,27.1-7.44,32.77-.56.47-1.25.7-1.92.7Z"
        />
      </G>
    </Svg>
  );
};
