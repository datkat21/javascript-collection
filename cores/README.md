# Cores

This folder contains cores I've made and collected over time.

## Core List (in order of creation)

- Saturn Core (not recommended, only for archival purposes)
- Pluto Core
- Cherry Tree Core
  - sub-project: Cherry Console
- Lumen Core (simple and experimental)

## Which one to use?

Saturn is old and tested, however is **not recommended** for newer projects and does not support newer features that Pluto does. Pluto allows you to use the Html library and other components better. Cherry Tree improves upon this by using JS imports directly for a better developer UX. As such, Cherry Tree Console was made using the Cherry Tree core. Lumen is experimental and simple, works well with JS imports, and uses maps to store process data.

Overall, Lumen is the smallest and simplest core there is yet, and should be usable for most basic needs.

## Core-specific oddities

Due to the nature of the Pluto core, it does not fare well on its own and requires several dependencies to function as intended. The example provided is incomplete and is not recommended for use.

## What about Window systems?

All cores after Saturn will use a dependent Window System library, which have evolved from my old WsWindow library into the modern and advanced window system library it is now.

## How to use

This will be a basic guide on how to select and use each different core to start your own project.

There are provided examples of using each core in a basic HTML app. You are free to start from the examples provided, but please keep the credits for preservation purposes.

### Start with Saturn

**It is not recommended to use Saturn as a core in a new project. Continue with caution and be aware that it is difficult to use and has a lack of documentation.**
Use the example in `examples/Saturn`. You'll find a pre set-up version of Saturn Core with the essentials.

### Start with Pluto

You may tinker with the example in `examples/Pluto`. There is a minimal reproducible example of Pluto itself.

### Start with Cherry Tree

Check out the example in `examples/CherryTree`. There is the cherry tree core, have fun.

### Start with Lumen

Give Lumen a try, and see `examples/Lumen`. The apps are pretty basic.