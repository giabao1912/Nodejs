const fs = require('fs')
const Path = require('path')
const { fileTypes, fileIcons } = require('./supportFiles')


exports.load = (userRoot, location) => {
    return new Promise((resolve, reject) => {
        let files = fs.readdirSync(location)
        let result = []

        files.forEach(f => {
            let name = f
            let path = location + "/" + name
            if (location.endsWith("/")) {
				// Path cho trang index
				path = location + name;
			}
            let ext = Path.extname(name)
            let stats = fs.statSync(path)
            let type = fileTypes[ext] || 'Other File'
            let icon = fileIcons[ext] || '<i class="fa-solid fa-file"></i>'
            let subPath = path.replace(userRoot, '')

            if(stats.isDirectory()) {
                if (subPath.startsWith("/")) {
					subPath = `?dir=${subPath.substring(1)}`;
				} else {
					subPath = `?dir=/${subPath}`;
				}
            }

            result.push({
                name: name,
                path: path,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                lastModified: stats.mtime,
                ext: ext,
                type: type,
                icon: icon,
                subPath: subPath
            })

            console.log(result)
        })

        resolve(result)
    })
}