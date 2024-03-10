import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
} from "@angular/animations";

export const slider = trigger("routeAnimations", [
  transition("* => isBelow", slideTo("top")),
  transition("* => isAbove", slideTo("bottom")),
  transition("isBelow => *", slideTo("top")),
  transition("isAbove => *", slideTo("bottom")),
  transition("* => *", slideTo("bottom")),
]);

function slideTo(direction: string) {
  const optional = { optional: true };
  return [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: 0,
          [direction]: 0,
          width: "100%",
        }),
      ],
      optional
    ),
    query(":enter", [style({ [direction]: "-100%" })], optional),
    group([
      query(":leave", [animate("1000ms ease", style({ [direction]: "100%" }))]),
      query(":enter", [animate("1000ms ease", style({ [direction]: "0%" }))]),
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    //query(':leave', animateChild()),
    //query(':enter', animateChild()),
  ];
}
