import sequelize from './db.js'
import database from 'sequelize'
const { DataTypes } = database

const Role = sequelize.define('roles', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(20)},
    permissions: {type: DataTypes.STRING(50)},
}, { timestamps: false, createdAt: false })

const User = sequelize.define("users", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING(20), unique: true},
    password: {type: DataTypes.STRING(64)},
    email: {type: DataTypes.STRING(30)},
    profileid: {type: DataTypes.INTEGER, unique: true},
    roleid: {type: DataTypes.INTEGER},
}, { timestamps: false, createdAt: false })

Role.hasMany(User, {foreignKey: "roleid"})

const Profile = sequelize.define("profiles", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    surname: {type: DataTypes.STRING(30)},
    name: {type: DataTypes.STRING(30)},
    patronymic: {type: DataTypes.STRING(30)},
    birthday: {type: DataTypes.DATE},
}, { timestamps: false, createdAt: false })

Profile.hasOne(User, {foreignKey: "profileid"})

const Pass = sequelize.define("passes", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATEONLY},
    name: {type: DataTypes.STRING(50)},
    docum: {type: DataTypes.STRING(64)},
    birthday: {type: DataTypes.DATEONLY},
    status: {type: DataTypes.STRING(20)},
    car_num: {type: DataTypes.STRING(10)},
    car_model: {type: DataTypes.STRING(20)},
    car_color: {type: DataTypes.STRING(20)},
    userid: {type: DataTypes.INTEGER},
    passtypeid: {type: DataTypes.INTEGER},
}, { timestamps: false, createdAt: false })

const PassType = sequelize.define("passtypes", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(20)},
}, { timestamps: false, createdAt: false })

PassType.hasMany(Pass, {foreignKey: "passtypeid"})
User.hasMany(Pass, {foreignKey: "userid"})

const User_Passtype = sequelize.define("users_passtypes", {
    userid: {type: DataTypes.INTEGER},
    passtypeid: {type: DataTypes.INTEGER},
}, { timestamps: false, createdAt: false })

User.belongsToMany(PassType, {through: User_Passtype, foreignKey: "userid"})
PassType.belongsToMany(User, {through: User_Passtype, foreignKey: "passtypeid"})

//User.belongsToMany(PassType, {through: "users_passtypes", timestamps: false, createdAt: false})
//PassType.belongsToMany(User, {through: "users_passtypes", timestamps: false, createdAt: false})

const Concordant = sequelize.define("concordants", {
    userid: {type: DataTypes.INTEGER},
    passid: {type: DataTypes.INTEGER},
    status: {type: DataTypes.BOOLEAN},
    comment: {type: DataTypes.TEXT},
}, { timestamps: false, createdAt: false })

User.belongsToMany(Pass, {through: Concordant, foreignKey: "userid"})
Pass.belongsToMany(User, {through: Concordant, foreignKey: "passid"})

const Material = sequelize.define("materials", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(30)},
    s_n: {type: DataTypes.STRING(20)},
    ed: {type: DataTypes.STRING(10)},
    quantity: {type: DataTypes.INTEGER},
    passid: {type: DataTypes.INTEGER},
}, { timestamps: false, createdAt: false })

Pass.hasMany(Material, {foreignKey: "passid"})

export {Role, User, Profile, Pass, PassType, User_Passtype, Concordant, Material}