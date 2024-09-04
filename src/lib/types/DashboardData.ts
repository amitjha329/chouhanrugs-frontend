export default interface DashboardData {
    orders: {
        today: number
        month: number
        year: number
        total: number
        pending: number
        delivered: number
        return: number
    }
    earning: {
        today: number
        month: number
        year: number
        total: number
    }
    general: {
        prod: number
        cats: number
        tags: number
        user: number
    }
}