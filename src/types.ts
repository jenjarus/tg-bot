interface IObjHears {
    [key: string]: {
        name: string,
        link: string
    }
}

interface IObjCommands {
    [key: string]: IArrCommandsMenu
}

interface IArrCommandsMenu {
    command: string,
    description: string,
}

export {IObjHears, IObjCommands, IArrCommandsMenu};