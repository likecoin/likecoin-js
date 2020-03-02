import * as $protobuf from "protobufjs";
/** Properties of a LikePayId. */
export interface ILikePayId {

    /** LikePayId uuid */
    uuid?: (Uint8Array|null);

    /** LikePayId address */
    address?: (Uint8Array|null);

    /** LikePayId amount */
    amount?: (Long|null);
}

/** Represents a LikePayId. */
export class LikePayId implements ILikePayId {

    /**
     * Constructs a new LikePayId.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILikePayId);

    /** LikePayId uuid. */
    public uuid: Uint8Array;

    /** LikePayId address. */
    public address: Uint8Array;

    /** LikePayId amount. */
    public amount: Long;

    /**
     * Creates a new LikePayId instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LikePayId instance
     */
    public static create(properties?: ILikePayId): LikePayId;

    /**
     * Encodes the specified LikePayId message. Does not implicitly {@link LikePayId.verify|verify} messages.
     * @param message LikePayId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILikePayId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LikePayId message, length delimited. Does not implicitly {@link LikePayId.verify|verify} messages.
     * @param message LikePayId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILikePayId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LikePayId message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LikePayId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LikePayId;

    /**
     * Decodes a LikePayId message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LikePayId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LikePayId;

    /**
     * Verifies a LikePayId message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LikePayId message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LikePayId
     */
    public static fromObject(object: { [k: string]: any }): LikePayId;

    /**
     * Creates a plain object from a LikePayId message. Also converts values to other types if specified.
     * @param message LikePayId
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LikePayId, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LikePayId to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
