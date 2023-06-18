interface IObjHears {
    [key: string]: {
        name: string,
        link: string
    }
}

interface IObjCommands {
    [key: string]: {
        command: string,
        description: string
    }
}

interface IArrCommandsMenu {
    command: string,
    description: string,
}

export {IObjHears, IObjCommands, IArrCommandsMenu};