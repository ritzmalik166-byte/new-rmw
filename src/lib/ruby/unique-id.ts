function uniqueIdGenerator(): string {
    const d = new Date();
    const dateTime =
        `${d.getFullYear()}` +
        `${String(d.getMonth() + 1).padStart(2, "0")}` +
        `${String(d.getDate()).padStart(2, "0")}` +
        `${String(d.getHours()).padStart(2, "0")}` +
        `${String(d.getMinutes()).padStart(2, "0")}` +
        `${String(d.getSeconds()).padStart(2, "0")}` +
        `${String(d.getMilliseconds()).padStart(3, "0")}`;
    const entropy =
        Math.random().toString(36).slice(2, 15) +
        Math.random().toString(36).slice(2, 15);
    return `${dateTime}-${entropy}`;
}

export default uniqueIdGenerator;
